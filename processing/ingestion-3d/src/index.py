import json
import os
import utils
import tqdm
import imageio
import shutil
import nibabel as nib
import numpy as np

with open('config.json') as config_file:
  config = json.load(config_file)
print('~~~~~~~')
print('CONFIG')
print('------')
utils.printConfig(config)
print('~~~~~~~')

if __name__ == '__main__':
  print('ingest')

  # for f in os.listdir(config['common']['DIR_ARTIFACTS']):
  #   os.remove(os.path.join(os.listdir(config['common']['DIR_ARTIFACTS'])), f)

  raw_files = utils.getFiles(config['common']['DIR_DATA'], config['common']['FILE_EXTENSIONS'])

  for f in raw_files:
    print(f['name'])
    img_3d_data = nib.load(f['path']).get_fdata()

    img_3d_array = np.asarray(img_3d_data)
    if (len(img_3d_array.shape) == 3):
      total_slices = img_3d_array.shape[2]

      for current_slice in range(0, total_slices):
        img_2d_data = img_3d_array[:, :, current_slice]
        print(len(img_2d_data.shape))
        image_name = f['name'][:-4] + '_z' + '{:0>3}'.format(str(current_slice+1)) + '.png'

        print('saving 2D image: ' + image_name)
        print(img_2d_data)
        imageio.imwrite(config['common']['DIR_ARTIFACTS'] + '/' + image_name, img_2d_data)