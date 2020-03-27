# config
program: generate.py
method: random
metric:
  name: generated_images_D(G(z))
  goal: minimize
  target: 0.5
parameters:
  learning_rate:
    distribution: uniform
    min: 0.00001
    max: 0.0002

program: generate.py
method: random
metric:
  name: loss_generator
  goal: minimize
  target: 0
parameters:
  epochs:
    distribution: uniform
    min: 20
    max: 200

# stop everything
docker stop $(docker ps -a -q) && \
  docker rm $(docker ps -a -q)

# run experiment
docker build -t data-generator ./models/data-generator \
 && docker run --gpus all -it -v ~/projects/cancer-detection/data:/code/data --env WANDB_API_KEY=e14fa7bc44812bccba6823933bfeb391ce61c571 data-generator sh -c \
 "wandb agent reidsteven75/image-generator/zw3tnoj2"
#  "python3 index.py"

