import json
import os
import utils
import tqdm
import shutil
import csv
from PIL import Image

with open('config.json') as config_file:
  config = json.load(config_file)
print('~~~~~~~~~')
print('Histogram')
print('---------')
print('config')
print('------')
utils.printConfig(config)
print('~~~~~~~')

if __name__ == '__main__':

  # for f in os.listdir(config['common']['DIR_ARTIFACTS']):
  #   os.remove(os.path.join(os.listdir(config['common']['DIR_ARTIFACTS'])), f)

  raw_files = utils.getFiles(config['common']['DIR_DATA'], config['common']['FILE_EXTENSIONS'])
  for image_file in raw_files:
    im = Image.open(image_file['path'])
    histogram_raw = im.histogram()
    histogram_json = json.dumps(histogram_raw)
    histogram_name = 'histogram-' + os.path.splitext(image_file['name'])[0]
    print('saving histogram: ' + histogram_name)
    with open(config['common']['DIR_ARTIFACTS'] + '/' + histogram_name + '.csv', 'w') as csv_file:
      wr = csv.writer(csv_file, dialect='excel')
      for pixel_count in histogram_raw:
        wr.writerow([pixel_count])
      print('created csv: ' + histogram_name)
    
    with open(config['common']['DIR_ARTIFACTS'] + '/' + histogram_name + '.json', 'w') as json_file:
      json.dump(histogram_json, json_file)
      print('created json: ' + histogram_name)