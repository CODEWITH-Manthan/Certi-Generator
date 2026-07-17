# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container
COPY . .

# Ensure the temp directory exists
RUN mkdir -p temp

# Expose port 8000
EXPOSE 8000

# Run the app using uvicorn (you could also use gunicorn here for better process management)
# Note: In production we remove --reload
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
