import os
MODE = os.environ['MODE']
print(MODE)

if __name__ == '__main__':
  if (MODE == 'generate'):
    import generate