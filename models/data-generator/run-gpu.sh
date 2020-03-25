docker build -t data-generator ./models/data-generator \
 && docker run --gpus all -it -v ~/projects/cancer-detection/data:/code/data --env WANDB_API_KEY=e14fa7bc44812bccba6823933bfeb391ce61c571 data-generator sh -c \
 wandb agent reidsteven75/image-generator/lrerqhcl
#  "python3 index.py"

docker stop $(docker ps -a -q) && \
  docker rm $(docker ps -a -q)