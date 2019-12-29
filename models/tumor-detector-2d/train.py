#!/usr/bin/python
import pandas as pd
import tensorflow as tf
import numpy as np
from sklearn.model_selection import train_test_split
from tabulate import tabulate
from multiprocessing import Pool
from tqdm import tqdm

import utils
import config

def printDatasetX(dataset):
  for x, y in dataset:
    print(x)

def printDatasetY(dataset):
  for x, y in dataset:
    print(y)

print('~ loading data ~')
dev_filepaths = {
  'none': utils.getFilePaths(config.DIR_DATA_TRAIN + '/dev/none'),
  'tumor': utils.getFilePaths(config.DIR_DATA_TRAIN + '/dev/tumor')
}
train_filepaths = {
  'none': utils.getFilePaths(config.DIR_DATA_TRAIN + '/train/none'),
  'tumor': utils.getFilePaths(config.DIR_DATA_TRAIN + '/train/tumor')
}
test_filepaths = {
  'none': utils.getFilePaths(config.DIR_DATA_TRAIN + '/test/none'),
  'tumor': utils.getFilePaths(config.DIR_DATA_TRAIN + '/test/tumor')
}

print('~ prepairing datasets ~')
dev_df = utils.parseTrainFoldersToDataFrame(dev_filepaths)
dev_tensor = utils.parseDataFrameToTensor(dev_df, config.TARGET)
dev = (dev_tensor.map(utils._encodeImage)
      .shuffle(buffer_size=10000)
      .batch(config.BATCH_SIZE)
      )

train_df = utils.parseTrainFoldersToDataFrame(train_filepaths)
train_tensor = utils.parseDataFrameToTensor(train_df, config.TARGET)
train = (train_tensor.map(utils._encodeImage)
      .shuffle(buffer_size=10000)
      .batch(config.BATCH_SIZE)
      )
train_num = train_df.shape[0]

test_df = utils.parseTrainFoldersToDataFrame(test_filepaths)
test_tensor = utils.parseDataFrameToTensor(test_df, config.TARGET)
test = (test_tensor.map(utils._encodeImage)
      .shuffle(buffer_size=10000)
      .batch(config.BATCH_SIZE)
      )

# print('~ transfer learning from MobileNetV2 ~')
# base_model = tf.keras.applications.MobileNetV2(
#   input_shape=IMG_SHAPE,
#   include_top=False,
#   weights='imagenet'
# )
# base_model.trainable = False

print('~ configuring & compiling model ~')
model = tf.keras.Sequential([
  # base_model,
  # tf.keras.layers.GlobalMaxPooling2D(),
  # tf.keras.layers.Dense(1, activation='sigmoid')
  tf.keras.layers.Conv2D(filters=16, kernel_size=(5,5),padding='Same', activation='relu', input_shape=(config.IMAGE_SIZE,config.IMAGE_SIZE,3)),
  tf.keras.layers.MaxPool2D(pool_size=(2,2)),
  tf.keras.layers.Dropout(0.2),
  tf.keras.layers.Conv2D(filters=64, kernel_size=(3,3),padding='Same', activation='relu'),
  tf.keras.layers.MaxPool2D(pool_size=(2,2), strides=(2,2)),
  tf.keras.layers.Dropout(0.2),
  tf.keras.layers.Conv2D(filters=64, kernel_size=(3,3),padding='Same', activation='relu'),
  tf.keras.layers.MaxPool2D(pool_size=(2,2), strides=(2,2)),
  tf.keras.layers.Dropout(0.2),
  tf.keras.layers.Flatten(),
  tf.keras.layers.Dense(512, activation='relu'),
  tf.keras.layers.Dense(1, activation='sigmoid')
])

model.compile(optimizer=tf.keras.optimizers.Adam(lr=config.LEARNING_RATE), 
              loss='binary_crossentropy',
              metrics=['accuracy'])

print(model.summary())

print('~ training model ~')
cp_callback = tf.keras.callbacks.ModelCheckpoint(filepath=config.DIR_CHECKPOINT + '/' + config.MODEL_NAME + '.ckpt',
                                                 save_weights_only=True,
                                                 verbose=1)

steps_per_epoch = round(train_num/config.BATCH_SIZE)
print('batch size: ' + str(config.BATCH_SIZE))
print('# samples: ' + str(train_num))
print('# batches: ' + str(round(train_num/config.BATCH_SIZE)))
model.fit_generator(train.repeat(), 
          epochs=config.TRAINING_EPOCHS,
          steps_per_epoch=steps_per_epoch,
          # callbacks=[cp_callback]
          )

print('~ scoring model ~')
model.evaluate_generator(test, verbose=2)

print('~ saving model ~')
model.save(config.DIR_TRAINED_MODEL + '/' + config.MODEL_NAME + '.h5')
print('saved model: ' + config.DIR_TRAINED_MODEL + '/' + config.MODEL_NAME + '.h5')