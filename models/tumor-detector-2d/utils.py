#!/usr/bin/python
import pandas as pd
import tensorflow as tf
import numpy as np
import os
from sklearn.model_selection import train_test_split
from tabulate import tabulate

import config

def printDatasets(X_train, Y_train, X_val, Y_val, X_test):
  count_train = np.size(X_train, 0)
  count_val = np.size(X_val, 0)
  count_test = np.size(X_test, 0)

  count_total = count_train + count_val + count_test

  header = ['DATASET', '# SAMPLES', '% DISTRIBUTION']
  table = [
    ['Train', f'{count_train:,}', count_train / count_total],
    ['Val', f'{count_val:,}', count_val / count_total],
    ['Test', f'{count_test:,}', count_test / count_total]
  ]
  print(tabulate(table, headers=header, tablefmt='fancy_grid'))

  header = ['DATASET', 'SHAPE']
  table = [
    ['X_train', X_train.shape],
    ['Y_train', Y_train.shape],
    ['X_val',X_val.shape],
    ['Y_val', Y_val.shape],
    ['X_test', X_test.shape]
  ]
  print(tabulate(table, headers=header, tablefmt='fancy_grid'))

def decodePredictions(predictions):
  decoded = []
  for i in range(predictions.shape[0]):
    decoded_datum = decode(predictions[i])
    decoded.append(decoded_datum)
  return(decoded)

def debugPredictions(predictions):
  for i in range(predictions.shape[0]):
    datum = predictions[i]
    print('index: %d' % i)
    print('encoded datum: %s' % datum)
    decoded_datum = decode(predictions[i])
    print('decoded datum: %s' % decoded_datum)
    print()

def validate(data):
  return(data.isnull().any().any())

def normalize(data):
  normalized = data / 255.0
  return(normalized)

def generateDataFrame(X, Y):
  df = pd.DataFrame(list(zip(Y, X)), columns=[config.TARGET, 'image'])
  return(df)

def parseDataFrameToTensor(df, target):
  Y = df.pop(target)
  dataset = tf.data.Dataset.from_tensor_slices(
    (df.values, Y.values)
  )
  return(dataset)

def parsePredictFoldersToDataFrame(filepaths_list):
  X = []
  for filepath in filepaths_list: 
    X.append(filepath)
  df = generateDataFrame(X,Y)
  return(df)

def parseTrainFoldersToDataFrame(filepaths_dict):
  Y = []
  X = []
  for label, filepaths in filepaths_dict.items():
    for filepath in filepaths: 
      X.append(filepath)
      Y.append(config.CLASS_ENCODINGS[label])
  df = generateDataFrame(X,Y)
  return(df)

def getFilePaths(dir):
  files = []
  for file in os.listdir(dir):
    if file.endswith('.png'):
      files.append(dir + '/' + file)
  return(files)

def _encodeImage(filepath, label='unknown'):
  img = tf.io.read_file(filepath[0])
  img = tf.image.decode_png(img, channels=3) # RGB
  img = (tf.cast(img, tf.float32)/127.5) - 1
  img = tf.image.resize(img, (config.IMAGE_SIZE, config.IMAGE_SIZE))
  return(img, label)