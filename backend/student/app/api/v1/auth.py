# File: Yuva-setu/backend/app/api/v1/auth.py
# File: Yuva-setu/backend/app/api/v1/auth.py
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, status, BackgroundTasks, Depends
from app.models.user import User, AuthProvider, EducationItem, ExperienceItem, TrainingItem, ProjectItem, SkillItem, PortfolioItem, AccomplishmentItem
from app.models.otp import OTPPurpose, OTPVerification
from app.schemas.auth import (
    SignupEmailRequest,
    SendEmailOTPRequest,
    VerifyEmailOTPRequest,
    PersonalDetailsRequest,
    SendPhoneOTPRequest,
    VerifyPhoneOTPRequest,
    CompleteProfileRequest,
    LoginRequest,
    ResendOTPRequest,
    TokenResponse,
    MessageResponse,
    GoogleAuthRequest
)
from app.services.otp import OTPService
from app.services.email import EmailService
from app.services.sms import sms_service
from app.services.google_auth import google_auth_service
from app.utils.security import (
    create_access_token,
    verify_password,
    get_password_hash
)
from app.api.deps import get_current_user
from app.services.totp import totp_service
from app.schemas.totp import (
    Enable2FAResponse,
    Verify2FARequest,
    Verify2FAResponse,
    Login2FARequest
)
import secrets
import logging

router = APIRouter(prefix="/auth", tags=["Authentication"])
logger = logging.getLogger(__name__)

# ============= 2FA SETUP =============

@router.post("/2fa/enable", response_model=Enable2FAResponse)
async def enable_2fa(current_user: User = Depends(get_current_user)):
    """
    Step 1: Enable 2FA for user.
    Returns QR code to scan with Google Authenticator.
    """
    try:
        # Generate new TOTP secret
        secret = totp_service.generate_secret()
        
        # Generate QR code
        qr_code = totp_service.generate_qr_code(secret, current_user.email)
        
        # Generate backup codes (for account recovery)
        backup_codes = [secrets.token_hex(4).upper() for _ in range(10)]
        
        # Store temporarily (not activated until verified)
        current_user.totp_secret = secret
        current_user.backup_codes = backup_codes
        await current_user.save()
        
        return Enable2FAResponse(
            success=True,
            message="Scan QR code with Google Authenticator app",
            qr_code=qr_code,
            secret=secret,  # For manual entry
            backup_codes=backup_codes
        )
        
    except Exception as e:
        logger.error(f"Failed to enable 2FA: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to setup 2FA"
        )


@router.post("/2fa/verify", response_model=Verify2FAResponse)
async def verify_and_activate_2fa(
    request: Verify2FARequest,
    current_user: User = Depends(get_current_user)
):
    """
    Step 2: Verify TOTP token and activate 2FA.
    User enters 6-digit code from their authenticator app.
    """
    if not current_user.totp_secret:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="2FA not initiated. Call /2fa/enable first."
        )
    
    # Verify the token
    is_valid = totp_service.verify_totp(current_user.totp_secret, request.token)
    
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification code. Please try again."
        )
    
    # Activate 2FA
    current_user.two_factor_enabled = True
    current_user.two_factor_verified_at = datetime.utcnow()
    await current_user.save()
    
    return Verify2FAResponse(
        success=True,
        message="2FA enabled successfully!",
        two_factor_enabled=True
    )


@router.post("/2fa/disable", response_model=MessageResponse)
async def disable_2fa(
    request: Verify2FARequest,  # Require current code to disable
    current_user: User = Depends(get_current_user)
):
    """Disable 2FA (requires current TOTP code for security)."""
    if not current_user.two_factor_enabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="2FA is not enabled"
        )
    
    # Verify token before disabling
    is_valid = totp_service.verify_totp(current_user.totp_secret, request.token)
    
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification code"
        )
    
    # Disable 2FA
    current_user.two_factor_enabled = False
    current_user.totp_secret = None
    current_user.backup_codes = []
    await current_user.save()
    
    return MessageResponse(
        success=True,
        message="2FA disabled successfully"
    )

# ============= EMAIL SIGNUP FLOW =============

@router.post("/signup/send-email-otp", response_model=MessageResponse)
async def send_email_otp_for_signup(
    request: SendEmailOTPRequest,
    background_tasks: BackgroundTasks
):
    """Step 1: Send OTP to email for signup verification."""
    
    # Check if user already exists
    existing_user = await User.find_one(User.email == request.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists"
        )
    
    # Validate passwords match
    if request.password != request.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match"
        )
    
    # Create OTP
    otp = await OTPService.create_otp(
        identifier=request.email,
        purpose=OTPPurpose.SIGNUP
    )
    
    # Store password temporarily in OTP record
    otp.metadata = {"password": request.password}
    await otp.save()
    
    # Send OTP email in background
    background_tasks.add_task(
        EmailService.send_otp_email,
        request.email,
        otp.otp_code,
        OTPPurpose.SIGNUP
    )
    
    return MessageResponse(
        success=True,
        message="OTP sent successfully to your email",
        data={"email": request.email}
    )

# File: Yuva-setu/backend/app/api/v1/auth.py
@router.post("/signup/verify-email", response_model=TokenResponse)
async def verify_email_and_create_account(request: VerifyEmailOTPRequest):
    """Step 2: Verify email OTP and create user account."""
    
    # Verify OTP
    success, error_msg, otp_verification = await OTPService.verify_otp(
        identifier=request.email,
        otp_code=request.otp,
        purpose=OTPPurpose.SIGNUP
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_msg
        )
    
    # Check terms agreement
    if not request.agreed_to_terms:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You must agree to the terms and conditions"
        )
    
    # Get password from OTP metadata (stored during OTP creation)
    password = otp_verification.metadata.get("password") if otp_verification and otp_verification.metadata else None
    if not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Session expired. Please restart signup process."
        )
    
    # Check if user already exists (double check)
    existing_user = await User.find_one(User.email == request.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists"
        )
    
    # Create user
    user = User(
        email=request.email,
        hashed_password=get_password_hash(password),
        auth_provider=AuthProvider.EMAIL,
        email_verified=True,
        is_verified=True,
        agreed_to_terms=True,
        terms_agreed_at=datetime.utcnow()
    )
    
    await user.insert()
    
    # Delete OTP record
    if otp_verification:
        await otp_verification.delete()
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return TokenResponse(
        access_token=access_token,
        user={
            "id": str(user.id),
            "email": user.email,
            "email_verified": user.email_verified,
            "profile_completed": user.profile_completed
        }
    )

# ============= GOOGLE OAUTH =============

@router.post("/google/signup", response_model=TokenResponse)
async def google_signup(request: GoogleAuthRequest):
    """Sign up or sign in with Google using Firebase."""
    
    # Verify Google token using Firebase
    google_user = google_auth_service.verify_google_token(request.id_token)
    
    if not google_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token"
        )
    
    # Check if user exists
    existing_user = await User.find_one(User.email == google_user['email'])
    
    if existing_user:
        # User exists, log them in
        if not existing_user.google_id:
            existing_user.google_id = google_user['google_id']
            await existing_user.save()
        
        user = existing_user
    else:
        # Create new user
        user = User(
            email=google_user['email'],
            google_id=google_user['google_id'],
            first_name=google_user.get('given_name', ''),
            last_name=google_user.get('family_name', ''),
            full_name=google_user.get('name', ''),
            profile_picture=google_user.get('picture'),
            auth_provider=AuthProvider.GOOGLE,
            email_verified=google_user.get('email_verified', True),
            is_verified=True,
            agreed_to_terms=True,
            terms_agreed_at=datetime.utcnow()
        )
        await user.insert()
    
    # Update last login
    user.last_login = datetime.utcnow()
    await user.save()
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return TokenResponse(
        access_token=access_token,
        user={
            "id": str(user.id),
            "email": user.email,
            "full_name": user.full_name,
            "profile_completed": user.profile_completed,
            "auth_provider": user.auth_provider
        }
    )

# ============= LOGIN FLOW (NO OTP) =============

@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    """Login with email and password (no OTP required)."""
    
    # Find user
    user = await User.find_one(User.email == request.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Check if user signed up with Google
    if user.auth_provider == AuthProvider.GOOGLE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please sign in with Google"
        )
    
    # Verify password
    if not user.hashed_password or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Update last login
    user.last_login = datetime.utcnow()
    await user.save()
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return TokenResponse(
        access_token=access_token,
        user={
            "id": str(user.id),
            "email": user.email,
            "full_name": user.full_name,
            "profile_completed": user.profile_completed,
            "auth_provider": user.auth_provider
        }
    )

# ============= RESEND OTP =============

@router.post("/resend-otp", response_model=MessageResponse)
async def resend_otp(
    request: ResendOTPRequest,
    background_tasks: BackgroundTasks
):
    """Resend OTP for any purpose."""
    
    # Create new OTP
    otp = await OTPService.create_otp(
        identifier=request.identifier,
        purpose=request.purpose
    )
    
    # Send OTP based on identifier type
    if '@' in request.identifier:
        background_tasks.add_task(
            EmailService.send_otp_email,
            request.identifier,
            otp.otp_code,
            request.purpose
        )
    
    return MessageResponse(
        success=True,
        message="OTP resent successfully"
    )

# ============= PERSONAL DETAILS & PHONE VERIFICATION =============

@router.post("/send-phone-otp", response_model=MessageResponse)
async def send_phone_otp(
    request: SendPhoneOTPRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
):
    """Send OTP to phone number for verification."""
    
    # Check if phone number is already taken by another user
    existing_user = await User.find_one(
        User.phone == request.phone,
        User.id != current_user.id
    )
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This phone number is already registered"
        )
    
    # Create OTP
    otp = await OTPService.create_otp(
        identifier=request.phone,
        purpose=OTPPurpose.PHONE_VERIFICATION,
        user_id=str(current_user.id)
    )
    
    # Send OTP SMS in background
    background_tasks.add_task(
        sms_service.send_otp_sms,
        request.phone,
        otp.otp_code
    )
    
    return MessageResponse(
        success=True,
        message="OTP sent successfully to your phone",
        data={"phone": request.phone}
    )

@router.post("/verify-phone-otp", response_model=MessageResponse)
async def verify_phone_otp(
    request: VerifyPhoneOTPRequest,
    current_user: User = Depends(get_current_user)
):
    """Verify phone OTP."""
    
    # Verify OTP
    success, error_msg, otp_verification = await OTPService.verify_otp(
        identifier=request.phone,
        otp_code=request.otp,
        purpose=OTPPurpose.PHONE_VERIFICATION
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_msg
        )
    
    # Update user's phone number
    current_user.phone = request.phone
    current_user.contact_number = request.phone
    current_user.phone_verified = True
    current_user.updated_at = datetime.utcnow()
    await current_user.save()
    
    # Delete OTP record
    await otp_verification.delete()
    
    return MessageResponse(
        success=True,
        message="Phone number verified successfully",
        data={"phone_verified": True}
    )

@router.put("/personal-details", response_model=MessageResponse)
async def update_personal_details(
    request: PersonalDetailsRequest,
    current_user: User = Depends(get_current_user)
):
    """Update user's personal details."""
    
    # Update user details
    current_user.full_name = request.full_name
    current_user.contact_number = request.contact_number
    current_user.address = request.address
    current_user.differently_abled = request.differently_abled
    current_user.updated_at = datetime.utcnow()
    
    # Split full name into first and last name
    name_parts = request.full_name.split(' ', 1)
    current_user.first_name = name_parts[0]
    current_user.last_name = name_parts[1] if len(name_parts) > 1 else ""
    
    await current_user.save()
    
    return MessageResponse(
        success=True,
        message="Personal details updated successfully",
        data={
            "profile_completed": current_user.profile_completed,
            "user": {
                "id": str(current_user.id),
                "email": current_user.email,
                "full_name": current_user.full_name,
                "phone_verified": current_user.phone_verified
            }
        }
    )

# ============= COMPLETE PROFILE (MULTI-STEP FORM) - UPDATED =============

# In auth.py, remove the duplicate complete-profile endpoint
# Keep only ONE complete-profile endpoint (the second one)

@router.put("/complete-profile", response_model=MessageResponse)
async def complete_profile(
    request: CompleteProfileRequest,
    current_user: User = Depends(get_current_user)
):
    """Update complete user profile from multi-step form."""
    
    try:
        logger.info(f"Updating profile for user: {current_user.email}")
        
        # Update basic profile fields
        current_user.first_name = request.first_name
        current_user.last_name = request.last_name
        current_user.phone = request.phone
        current_user.contact_number = request.phone
        
        # Parse date of birth
        if request.date_of_birth:
            try:
                current_user.date_of_birth = datetime.fromisoformat(request.date_of_birth.replace('Z', '+00:00'))
            except ValueError:
                try:
                    current_user.date_of_birth = datetime.strptime(request.date_of_birth, "%Y-%m-%d")
                except ValueError as e:
                    logger.warning(f"Could not parse date_of_birth: {request.date_of_birth}, error: {e}")
        
        current_user.gender = request.gender
        current_user.address = request.address
        current_user.location_query = request.location_query
        
        # Store location coordinates for map functionality
        if request.location_latitude and request.location_longitude:
            current_user.location_coordinates = {
                "type": "Point",
                "coordinates": [request.location_longitude, request.location_latitude]
            }
        
        current_user.languages = request.languages
        current_user.linkedin = request.linkedin
        current_user.career_objective = request.career_objective
        
        # Convert dynamic sections from frontend format to backend models
        # Education - handle both fieldOfStudy and field_of_study
        current_user.education = []
        for i, edu in enumerate(request.education or []):
            education_item = EducationItem(
                id=edu.get('id', i),
                institution=edu.get('institution', ''),
                degree=edu.get('degree', ''),
                field_of_study=edu.get('fieldOfStudy') or edu.get('field_of_study', ''),
                start_year=edu.get('startYear') or edu.get('start_year', ''),
                end_year=edu.get('endYear') or edu.get('end_year', ''),
                score=edu.get('score', '')
            )
            current_user.education.append(education_item)
        
        # Experience
        current_user.experience = []
        for i, exp in enumerate(request.experience or []):
            experience_item = ExperienceItem(
                id=exp.get('id', i),
                type=exp.get('type', 'Internship'),
                company=exp.get('company', ''),
                role=exp.get('role', ''),
                start_date=exp.get('startDate') or exp.get('start_date', ''),
                end_date=exp.get('endDate') or exp.get('end_date', ''),
                description=exp.get('description', '')
            )
            current_user.experience.append(experience_item)
        
        # Trainings
        current_user.trainings = []
        for i, training in enumerate(request.trainings or []):
            training_item = TrainingItem(
                id=training.get('id', i),
                title=training.get('title', ''),
                provider=training.get('provider', ''),
                duration=training.get('duration', ''),
                description=training.get('description', ''),
                credential_link=training.get('credentialLink') or training.get('credential_link', '')
            )
            current_user.trainings.append(training_item)
        
        # Projects
        current_user.projects = []
        for i, project in enumerate(request.projects or []):
            project_item = ProjectItem(
                id=project.get('id', i),
                title=project.get('title', ''),
                role=project.get('role', ''),
                technologies=project.get('technologies', ''),
                description=project.get('description', '')
            )
            current_user.projects.append(project_item)
        
        # Skills
        current_user.skills = []
        for i, skill in enumerate(request.skills or []):
            skill_item = SkillItem(
                id=skill.get('id', i),
                name=skill.get('name', ''),
                level=skill.get('level', 'Intermediate')
            )
            current_user.skills.append(skill_item)
        
        # Portfolio
        current_user.portfolio = []
        for i, item in enumerate(request.portfolio or []):
            portfolio_item = PortfolioItem(
                id=item.get('id', i),
                title=item.get('title', ''),
                link=item.get('link', ''),
                description=item.get('description', '')
            )
            current_user.portfolio.append(portfolio_item)
        
        # Accomplishments
        current_user.accomplishments = []
        for i, acc in enumerate(request.accomplishments or []):
            accomplishment_item = AccomplishmentItem(
                id=acc.get('id', i),
                title=acc.get('title', ''),
                description=acc.get('description', ''),
                credential_url=acc.get('credentialUrl') or acc.get('credential_url', '')
            )
            current_user.accomplishments.append(accomplishment_item)
        
        # Mark profile as completed
        current_user.profile_completed = True
        current_user.updated_at = datetime.utcnow()
        
        await current_user.save()
        
        logger.info(f"Profile completed successfully for: {current_user.email}")
        
        return MessageResponse(
            success=True,
            message="Profile updated successfully",
            data={
                "profile_completed": True,
                "user": {
                    "id": str(current_user.id),
                    "email": current_user.email,
                    "first_name": current_user.first_name,
                    "last_name": current_user.last_name,
                    "profile_completed": current_user.profile_completed
                }
            }
        )
    
    except Exception as e:
        logger.error(f"Error updating profile: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update profile"
        )

# ============= GOOGLE OAUTH =============

@router.post("/google/login", response_model=TokenResponse)
async def google_login(request: GoogleAuthRequest):
    """Login with Google."""
    
    try:
        # Verify Google token
        google_user = google_auth_service.verify_google_token(request.id_token)
        
        if not google_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Google token"
            )
        
        # Check if user exists
        existing_user = await User.find_one(User.email == google_user['email'])
        
        if not existing_user:
            # Create new user if doesn't exist
            existing_user = User(
                email=google_user['email'],
                google_id=google_user.get('google_id', ''),
                first_name=google_user.get('given_name', ''),
                last_name=google_user.get('family_name', ''),
                full_name=google_user.get('name', ''),
                profile_picture=google_user.get('picture'),
                auth_provider=AuthProvider.GOOGLE,
                email_verified=True,
                is_verified=True,
                agreed_to_terms=True,
                terms_agreed_at=datetime.utcnow()
            )
            await existing_user.insert()
            logger.info(f"Created new user via Google: {google_user['email']}")
        else:
            # Update existing user
            if not existing_user.google_id:
                existing_user.google_id = google_user.get('google_id', '')
            existing_user.last_login = datetime.utcnow()
            await existing_user.save()
        
        # Create access token
        access_token = create_access_token(data={"sub": str(existing_user.id)})
        
        logger.info(f"Google login successful for: {existing_user.email}")
        
        return TokenResponse(
            access_token=access_token,
            user={
                "id": str(existing_user.id),
                "email": existing_user.email,
                "first_name": existing_user.first_name,
                "last_name": existing_user.last_name,
                "full_name": existing_user.full_name,
                "profile_completed": existing_user.profile_completed,
                "auth_provider": existing_user.auth_provider
            }
        )
        
    except Exception as e:
        logger.error(f"Google login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )

# ============= GET CURRENT USER =============

@router.get("/me", response_model=dict)
async def get_current_user_details(current_user: User = Depends(get_current_user)):
    """Get current user details."""
    
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "full_name": current_user.full_name,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "phone": current_user.phone,
        "phone_verified": current_user.phone_verified,
        "email_verified": current_user.email_verified,
        "profile_completed": current_user.profile_completed,
        "auth_provider": current_user.auth_provider,
        "address": current_user.address,
        "date_of_birth": current_user.date_of_birth.isoformat() if current_user.date_of_birth else None,
        "gender": current_user.gender,
        "location_query": current_user.location_query,
        "languages": current_user.languages,
        "linkedin": current_user.linkedin,
        "career_objective": current_user.career_objective,
        # Convert nested models to dict
        "education": [{
            "id": edu.id,
            "institution": edu.institution,
            "degree": edu.degree,
            "fieldOfStudy": edu.field_of_study,
            "startYear": edu.start_year,
            "endYear": edu.end_year,
            "score": edu.score
        } for edu in current_user.education],
        "experience": [{
            "id": exp.id,
            "type": exp.type,
            "company": exp.company,
            "role": exp.role,
            "startDate": exp.start_date,
            "endDate": exp.end_date,
            "description": exp.description
        } for exp in current_user.experience],
        "trainings": [{
            "id": training.id,
            "title": training.title,
            "provider": training.provider,
            "duration": training.duration,
            "description": training.description,
            "credentialLink": training.credential_link
        } for training in current_user.trainings],
        "projects": [{
            "id": project.id,
            "title": project.title,
            "role": project.role,
            "technologies": project.technologies,
            "description": project.description
        } for project in current_user.projects],
        "skills": [{
            "id": skill.id,
            "name": skill.name,
            "level": skill.level
        } for skill in current_user.skills],
        "portfolio": [{
            "id": item.id,
            "title": item.title,
            "link": item.link,
            "description": item.description
        } for item in current_user.portfolio],
        "accomplishments": [{
            "id": acc.id,
            "title": acc.title,
            "description": acc.description,
            "credentialUrl": acc.credential_url
        } for acc in current_user.accomplishments],
        "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
        "updated_at": current_user.updated_at.isoformat() if current_user.updated_at else None
    }