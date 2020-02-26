import os
MODE = os.environ['MODE']
print(MODE)
print(os.environ['WANDB_API_KEY'])
if __name__ == '__main__':
  if (MODE == 'train'):
    import train
  elif (MODE == 'predict'):
    import predict
  elif (MODE == 'generate'):
    import generate