FROM pytorch/pytorch:1.4-cuda10.1-cudnn7-devel

# Set working dir
WORKDIR /code

# Install packages
COPY requirements.txt /code/
RUN pip install -r requirements.txt 

# Copy code
COPY ./src/ /code