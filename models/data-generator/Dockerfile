FROM pytorch/pytorch:1.4-cuda10.1-cudnn7-devel

# Set working dir
WORKDIR /code

# Install packages
COPY requirements.txt /code/
RUN pip install -r requirements.txt 

# Copy code
COPY ./src/ /code

# BUILD COMMAND
# -------------
# docker build -t data-generator ./models/data-generator \
#  && docker run -it -v ~/projects/cancer-detection/datasets:/code/data --env WANDB_API_KEY=e14fa7bc44812bccba6823933bfeb391ce61c571 data-generator sh -c "python3 index.py"