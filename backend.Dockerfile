# Python Backend Dockerfile
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Working directory
WORKDIR /app

# Install system dependencies
# gcc and python3-dev are often needed for compiling some python packages (like some versions of cffi, psutil, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Argument for project path
ARG PROJECT_PATH

# Check if PROJECT_PATH is set
RUN if [ -z "$PROJECT_PATH" ]; then echo "PROJECT_PATH argument is required"; exit 1; fi

# Copy requirements file first for caching
COPY ${PROJECT_PATH}/requirements.txt ./requirements.txt

# Install python dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the entire backend directory structure to preserve imports
# We copy everything at the backend root level to /app/backend to maintain import paths like 'from app.main import ...'
# if the code expects to be run from 'backend/' root.
# However, usually uvicorn is run from the directory containing 'app'.
# Let's check how the user runs it: "cd backend/student && uvicorn app.main:app"
# This means the 'app' module is inside 'backend/student'.

# Copy the specific project code
COPY ${PROJECT_PATH} /app

# Expose port (default 8000, can be overridden)
EXPOSE 8000

# Command to run application
# We use shell form to allow variable expansion if needed, but standard array form is safer.
# We'll assume the standard entry point is app.main:app.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
