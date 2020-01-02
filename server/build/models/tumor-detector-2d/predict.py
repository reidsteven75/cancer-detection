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

print('~ load data ~')
dataset_filepaths = utils.getFilePaths(config.DIR_DATA_PREDICT)
df = pd.DataFrame(list(dataset_filepaths), columns=['image'])
dataset = tf.data.Dataset.from_tensor_slices(
    (df.values)
  )
dataset = (dataset.map(utils._encodeImage)
          .batch(config.BATCH_SIZE)
        )

print(dataset_filepaths)
print(dataset)

print('~ load model ~')
model = tf.keras.models.load_model(config.DIR_TRAINED_MODEL + '/' + config.MODEL_NAME + '.h5')

print('~ predicting ~')
predictions = model.predict(dataset)
print(predictions)

print('~ done ~')