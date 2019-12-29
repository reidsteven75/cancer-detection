#!/usr/bin/python
import pandas as pd
import tensorflow as tf
import numpy as np
from sklearn.model_selection import train_test_split
from tabulate import tabulate
from multiprocessing import Pool
from tqdm import tqdm

import utils

print('~ load data ~')
dataset_filepaths = utils.getFilePaths(DIR_DATA_PREDICT)
# print(dataset)
# dataset = tf.data.Dataset.from_tensor_slices(
#     (tf.constant(dataset))
#   )
# print(dataset)
# dataset = (dataset.map(_encodeImage))

dataset = utils.parseFoldersToDataFrame(dataset_filepaths)
dataset = utils.parseDataFrameToTensor(dataset, config.TARGET)
dataset = (dataset.map(utils._encodeImage))

print(dataset)

print('~ load model ~')
model = tf.keras.models.load_model(config.DIR_TRAINED_MODEL + '/' + config.MODEL_NAME + '.h5')

print('~ predicting ~')
predictions = model.predict(dataset)
print(predictions)

print('~ done ~')