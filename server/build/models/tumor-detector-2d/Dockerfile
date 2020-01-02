FROM tensorflow/tensorflow:2.1.0rc2-py3

# Set working dir
WORKDIR /code

# Install packages
COPY requirements*.txt /code/
RUN pip3 install -r requirements.txt 

# Copy code
COPY . /code