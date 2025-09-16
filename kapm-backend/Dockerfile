# Backend Dockerfile - Django na porcie 8003
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    gcc \
    python3-dev \
    musl-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN pip install gunicorn

# Copy project
COPY . /app/

# Create non-root user
RUN useradd -m -u 1001 django && chown -R django:django /app
USER django

# Collect static files
RUN python manage.py collectstatic --noinput || true

# WAŻNE: Backend ZAWSZE na porcie 8003
EXPOSE 8003

# Run migrations and start server on port 8003
CMD python manage.py migrate && \
    gunicorn config.wsgi:application \
    --bind 0.0.0.0:8003 \
    --workers 3 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -