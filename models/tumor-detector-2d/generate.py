#!/usr/bin/python
from __future__ import absolute_import, division, print_function, unicode_literals
import tensorflow as tf
import glob
import imageio
import numpy as np
import os
import PIL
from tensorflow.keras import layers
import time
from tqdm import tqdm
import wandb
from wandb.keras import WandbCallback

import utils
import config

wandb.init(project='image-generator-tumor-brain', sync_tensorboard=True)

DIR_DATA_GENERATE = config.DIR_DATA_GENERATE
BUFFER_SIZE = 60000
BATCH_SIZE = 10
IMAGE_SIZE = 28
CHANNELS = 1
EPOCHS = 500
noise_dim = 100
num_examples_to_generate = 1

cross_entropy = tf.keras.losses.BinaryCrossentropy(from_logits=True)
generator_optimizer = tf.keras.optimizers.Adam(1e-4)
discriminator_optimizer = tf.keras.optimizers.Adam(1e-4)
seed = tf.random.normal([num_examples_to_generate, noise_dim])

# ===
# GAN 
# ===

# Generator
# ---------
def make_generator_model():
  model = tf.keras.Sequential()
  model.add(layers.Dense(7*7*256, use_bias=False, input_shape=(100,)))
  model.add(layers.BatchNormalization())
  model.add(layers.LeakyReLU())

  model.add(layers.Reshape((7, 7, 256)))
  assert model.output_shape == (None, 7, 7, 256) # Note: None is the batch size

  model.add(layers.Conv2DTranspose(128, (5, 5), strides=(1, 1), padding='same', use_bias=False))
  assert model.output_shape == (None, 7, 7, 128)
  model.add(layers.BatchNormalization())
  model.add(layers.LeakyReLU())

  model.add(layers.Conv2DTranspose(64, (5, 5), strides=(2, 2), padding='same', use_bias=False))
  assert model.output_shape == (None, 14, 14, 64)
  model.add(layers.BatchNormalization())
  model.add(layers.LeakyReLU())

  model.add(layers.Conv2DTranspose(1, (5, 5), strides=(2, 2), padding='same', use_bias=False, activation='tanh'))
  assert model.output_shape == (None, IMAGE_SIZE, IMAGE_SIZE, 1)

  return model

def generator_loss(fake_output):
  return cross_entropy(tf.ones_like(fake_output), fake_output)

# Discriminator
# -------------
def make_discriminator_model():
  model = tf.keras.Sequential()
  model.add(layers.Conv2D(64, (5, 5), strides=(2, 2), padding='same',
                                    input_shape=[IMAGE_SIZE, IMAGE_SIZE, CHANNELS]))
  model.add(layers.LeakyReLU())
  model.add(layers.Dropout(0.3))

  model.add(layers.Conv2D(128, (5, 5), strides=(2, 2), padding='same'))
  model.add(layers.LeakyReLU())
  model.add(layers.Dropout(0.3))

  model.add(layers.Flatten())
  model.add(layers.Dense(1))

  return model

def discriminator_loss(real_output, fake_output):
  real_loss = cross_entropy(tf.ones_like(real_output), real_output)
  fake_loss = cross_entropy(tf.zeros_like(fake_output), fake_output)
  total_loss = real_loss + fake_loss
  return total_loss

def generate_and_save_images(model, epoch, test_input):
  predictions = model(test_input, training=False)
  image = predictions[0, :, :, 0] * 127.5 + 127.5
  wandb.log({'Generated Images': [wandb.Image(image, caption="Brain")]})
  imageio.imwrite(config.DIR_ARTIFACTS + '/generated2/' + 'gan_' + str(epoch) + '.jpg', image)

@tf.function
def train_step(images, generator, discriminator, epoch):
  noise = tf.random.normal([BATCH_SIZE, noise_dim])

  with tf.GradientTape() as gen_tape, tf.GradientTape() as disc_tape:
    generated_images = generator(noise, training=True)

    print('debug')
    print(images)
    for img in images:
      print('img')
      print(img)
    # exit()

    real_output = discriminator(images, training=True)
    fake_output = discriminator(generated_images, training=True)

    gen_loss = generator_loss(fake_output)
    disc_loss = discriminator_loss(real_output, fake_output)
    
    # print('=======')
    # print(gen_loss)
    # print(gen_loss.get_shape())
    # print(gen_loss.eval(session=tf.compat.v1.Session()))
    # wandb.log({'epoch': epoch, 'generator loss': gen_loss})
    # wandb.log({'epoch': epoch, 'discriminator loss': disc_loss})

  gradients_of_generator = gen_tape.gradient(gen_loss, generator.trainable_variables)
  gradients_of_discriminator = disc_tape.gradient(disc_loss, discriminator.trainable_variables)

  generator_optimizer.apply_gradients(zip(gradients_of_generator, generator.trainable_variables))
  discriminator_optimizer.apply_gradients(zip(gradients_of_discriminator, discriminator.trainable_variables))

def train(dataset, epochs, generator, discriminator):
  progress_epoch = tqdm(total=epochs, unit=' epoch')
  
  for epoch in range(epochs):
    start = time.time()

    for image_batch in dataset:
      train_step(image_batch, generator, discriminator, epoch)

    progress_epoch.update(1)
    print ('Time for epoch {} is {} sec'.format(epoch + 1, time.time()-start))
    generate_and_save_images(generator,
                            epoch,
                            seed)

def decode_img(img):
  img = tf.image.decode_png(img, channels=CHANNELS)
  img = (tf.cast(img, tf.float32) - 127.5) / 127.5
  # img = tf.image.convert_image_dtype(img, tf.float32)
  img = tf.image.resize(img, [IMAGE_SIZE, IMAGE_SIZE])
  # img = tf.image.per_image_standardization(img)
  return img

def process_path(file_path):
  img = tf.io.read_file(file_path)
  img = decode_img(img)
  return img

print('~ load data ~')
list_ds = tf.data.Dataset.list_files(DIR_DATA_GENERATE + '/*.png')
train_dataset = list_ds.map(process_path).shuffle(BUFFER_SIZE).batch(BATCH_SIZE)

# (train_images, train_labels), (_, _) = tf.keras.datasets.mnist.load_data()
# train_images = train_images.reshape(train_images.shape[0], 28, 28, 1).astype('float32')
# train_images = (train_images - 127.5) / 127.5 # Normalize the images to [-1, 1]
# train_dataset = tf.data.Dataset.from_tensor_slices(train_images).shuffle(BUFFER_SIZE).batch(BATCH_SIZE)


print('~ load models ~')
generator = make_generator_model()
discriminator = make_discriminator_model()

print(train_dataset)

train(train_dataset, EPOCHS, generator, discriminator)
  
    
