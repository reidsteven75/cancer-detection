#!/usr/bin/python

# COMMON
DIR_DATA_TRAIN = './data/brain_tumors'
DIR_CHECKPOINT = './checkpoints'
DIR_TRAINED_MODEL = './trained-model'
DIR_ARTIFACTS = './artifacts'
MODEL_NAME = 'tumor-detector-2d'
TARGET = 'label'
IMAGE_SIZE = 96 # Minimum image size for use with MobileNetV2
IMG_SHAPE = (IMAGE_SIZE, IMAGE_SIZE, 3)

CLASS_ENCODINGS = {
  'none': 0,
  'tumor': 1 
}

# PREDICT
DIR_DATA_PREDICT = './data/predict'

# GENERATE
DIR_DATA_GENERATE = './data/generate'

# TRAIN
VAL_TRAIN_RATIO = 0.3  # VAL / TEST
BATCH_SIZE = 32
LEARNING_RATE = 0.0001 / 10
TRAINING_EPOCHS = 40
