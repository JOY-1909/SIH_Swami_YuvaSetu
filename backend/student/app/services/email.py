# File: Yuva-setu/backend/app/services/email.py
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from app.config import settings
import logging
import asyncio

logger = logging.getLogger(__name__)

class EmailService:
    """Enhanced Email service with retry mechanism and better templates."""
    
    @staticmethod
    async def send_email(
        to_email: str,
        subject: str,
        html_content: str,
        text_content: Optional[str] = None,
        max_retries: int = 3
    ) -> bool:
        """Send an email using SMTP with retry mechanism."""
        
        for attempt in range(max_retries):
            try:
                # Validate configuration
                required_config = [settings.SMTP_HOST, settings.SMTP_PORT, settings.SMTP_USER, settings.SMTP_PASSWORD]
                if not all(required_config):
                    logger.error("SMTP configuration is incomplete")
                    return False

                message = MIMEMultipart("alternative")
                message["Subject"] = subject
                message["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM}>"
                message["To"] = to_email
                message["Reply-To"] = settings.SMTP_FROM
                
                # Add text and HTML parts
                if text_content:
                    part1 = MIMEText(text_content, "plain")
                    message.attach(part1)
                
                part2 = MIMEText(html_content, "html")
                message.attach(part2)
                
                logger.info(f"Attempt {attempt + 1}: Sending email to {to_email}")
                
                # Send email
                await aiosmtplib.send(
                    message,
                    hostname=settings.SMTP_HOST,
                    port=settings.SMTP_PORT,
                    username=settings.SMTP_USER,
                    password=settings.SMTP_PASSWORD,
                    use_tls=True,
                    timeout=30,
                )
                
                logger.info(f"✅ Email sent successfully to {to_email}")
                return True
                
            except aiosmtplib.SMTPAuthenticationError as e:
                logger.error(f"SMTP Authentication failed: {str(e)}")
                if attempt == max_retries - 1:
                    logger.error("Please check: 1) Gmail App Password is correct 2) 2FA is enabled 3) App Password is generated")
                    return False
                
            except aiosmtplib.SMTPConnectError as e:
                logger.error(f"SMTP Connection failed: {str(e)}")
                if attempt == max_retries - 1:
                    return False
                    
            except aiosmtplib.SMTPServerDisconnected as e:
                logger.error(f"SMTP Server disconnected: {str(e)}")
                if attempt == max_retries - 1:
                    return False
                    
            except Exception as e:
                logger.error(f"Attempt {attempt + 1} failed: {str(e)}")
                if attempt == max_retries - 1:
                    return False
            
            # Wait before retry
            if attempt < max_retries - 1:
                await asyncio.sleep(2 ** attempt)  # Exponential backoff
        
        return False
    
    @staticmethod
    async def send_otp_email(to_email: str, otp_code: str, purpose: str) -> bool:
        """Send OTP verification email with professional templates."""
        
        subject_map = {
            "signup": "Verify Your Email - Yuva Setu",
            "login": "Your Login Code - Yuva Setu", 
            "password_reset": "Reset Your Password - Yuva Setu",
            "email_verification": "Verify Your Email - Yuva Setu"
        }
        
        subject = subject_map.get(purpose, "Your Verification Code - Yuva Setu")
        
        # Professional HTML template
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification</title>
            <style>
                body {{ 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    line-height: 1.6; 
                    color: #333; 
                    margin: 0; 
                    padding: 0; 
                    background-color: #f6f9fc;
                }}
                .container {{ 
                    max-width: 600px; 
                    margin: 0 auto; 
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
                }}
                .header {{ 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 40px 30px; 
                    text-align: center; 
                }}
                .header h1 {{
                    margin: 0;
                    font-size: 32px;
                    font-weight: 700;
                    letter-spacing: -0.5px;
                }}
                .header p {{
                    margin: 10px 0 0 0;
                    opacity: 0.9;
                    font-size: 16px;
                }}
                .content {{ 
                    padding: 40px 30px; 
                }}
                .otp-container {{
                    text-align: center;
                    margin: 30px 0;
                }}
                .otp-code {{ 
                    font-size: 42px; 
                    font-weight: 700; 
                    color: #667eea; 
                    letter-spacing: 8px; 
                    margin: 20px 0;
                    font-family: 'Courier New', monospace;
                    background: #f8f9ff;
                    padding: 20px;
                    border-radius: 10px;
                    border: 2px solid #e1e5ff;
                }}
                .info-box {{ 
                    background: #f8f9fa; 
                    border-left: 4px solid #667eea; 
                    border-radius: 8px; 
                    padding: 20px; 
                    margin: 30px 0; 
                }}
                .footer {{ 
                    margin-top: 40px; 
                    text-align: center; 
                    font-size: 14px; 
                    color: #666; 
                    border-top: 1px solid #eee;
                    padding-top: 30px;
                }}
                .button {{
                    display: inline-block;
                    background: #667eea;
                    color: white;
                    padding: 12px 30px;
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: 600;
                    margin: 10px 0;
                }}
                .note {{
                    background: #fff3cd;
                    border: 1px solid #ffeaa7;
                    border-radius: 8px;
                    padding: 15px;
                    margin: 20px 0;
                    font-size: 14px;
                    color: #856404;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎯 Yuva Setu</h1>
                    <p>Your Gateway to Career Opportunities</p>
                </div>
                <div class="content">
                    <h2 style="color: #333; margin-bottom: 10px;">Verification Code</h2>
                    <p style="color: #666; font-size: 16px;">Hello there,</p>
                    <p style="color: #666; font-size: 16px;">Please use the following verification code to complete your action:</p>
                    
                    <div class="otp-container">
                        <div class="otp-code">{otp_code}</div>
                    </div>
                    
                    <div class="note">
                        <strong>⏰ This code will expire in {settings.OTP_EXPIRE_MINUTES} minutes.</strong>
                        <br>For your security, please do not share this code with anyone.
                    </div>
                    
                    <div class="info-box">
                        <strong>Why you're receiving this email:</strong>
                        <p style="margin: 10px 0 0 0; color: #666;">
                            This verification code was requested for your Yuva Setu account. 
                            If you didn't request this code, please ignore this email or 
                            contact our support team if you have concerns.
                        </p>
                    </div>
                    
                    <p style="color: #666; font-size: 16px;">
                        Best regards,<br>
                        <strong>The Yuva Setu Team</strong>
                    </p>
                    
                    <div class="footer">
                        <p>© 2024 Yuva Setu. All rights reserved.</p>
                        <p>This is an automated message, please do not reply to this email.</p>
                        <p style="font-size: 12px; color: #999;">
                            Yuva Setu - Empowering students with internship opportunities
                        </p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        YUVA SETU - VERIFICATION CODE
        
        Your verification code is: {otp_code}
        
        This code will expire in {settings.OTP_EXPIRE_MINUTES} minutes.
        
        Why you're receiving this email:
        This verification code was requested for your Yuva Setu account. 
        If you didn't request this code, please ignore this email.
        
        For security reasons, please do not share this code with anyone.
        
        --
        Best regards,
        The Yuva Setu Team
        
        Yuva Setu - Empowering students with internship opportunities
        © 2024 Yuva Setu. All rights reserved.
        """
        
        success = await EmailService.send_email(to_email, subject, html_content, text_content)
        
        if not success:
            # Development fallback - log to console
            logger.warning(f"📧 Email sending failed. OTP for {to_email}: {otp_code}")
            print(f"\n{'='*80}")
            print("🚨 EMAIL OTP (DEVELOPMENT FALLBACK)")
            print(f"   📨 To: {to_email}")
            print(f"   🔑 OTP Code: {otp_code}") 
            print(f"   🎯 Purpose: {purpose}")
            print(f"   ⏰ Expires in: {settings.OTP_EXPIRE_MINUTES} minutes")
            print(f"   📝 Note: Configure SMTP in .env to send actual emails")
            print(f"{'='*80}\n")
        
        return success

    @staticmethod
    async def test_smtp_connection() -> dict:
        """Test SMTP connection and configuration."""
        test_data = {
            "smtp_host": settings.SMTP_HOST,
            "smtp_port": settings.SMTP_PORT,
            "smtp_user": settings.SMTP_USER,
            "from_email": settings.SMTP_FROM,
            "status": "unknown",
            "error": None,
            "details": {}
        }
        
        try:
            # Test connection
            server = aiosmtplib.SMTP(
                hostname=settings.SMTP_HOST,
                port=settings.SMTP_PORT,
                use_tls=True
            )
            
            await server.connect()
            test_data["details"]["connection"] = "✅ Connected successfully"
            
            # Test authentication
            await server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            test_data["details"]["authentication"] = "✅ Authenticated successfully"
            
            await server.quit()
            test_data["status"] = "success"
            
        except aiosmtplib.SMTPAuthenticationError as e:
            test_data["status"] = "authentication_failed"
            test_data["error"] = str(e)
            test_data["details"]["authentication"] = "❌ Failed - Check App Password"
            
        except aiosmtplib.SMTPConnectError as e:
            test_data["status"] = "connection_failed" 
            test_data["error"] = str(e)
            test_data["details"]["connection"] = "❌ Failed - Check host/port"
            
        except Exception as e:
            test_data["status"] = "error"
            test_data["error"] = str(e)
            
        return test_data