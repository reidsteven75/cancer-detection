FROM python:3.8

# Set working dir
WORKDIR /code

# Install packages
COPY requirements.txt /code/
RUN pip install -r requirements.txt 

# Copy code
COPY ./src/ /code