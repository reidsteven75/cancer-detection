import json
import os
import utils
import tqdm
import shutil
import csv
from PIL import Image
from tabulate import tabulate

with open('config.json') as config_file:
  config = json.load(config_file)
print('~~~~~~~~~')
print('Histogram')
print('---------')
print('config')
print('------')
utils.printConfig(config)
print('~~~~~~~')

def exportResults_CSV(results):
  with open(config['COMMON']['DIR_ARTIFACTS'] + '/results.csv', 'w') as csv_file:
    wr = csv.writer(csv_file, dialect='excel')
    for row in results:
      wr.writerow(row)
    print('created csv: results.csv')

def printResults(results):
  csv_export = []
  header = ['IMAGE', 'CHANNEL-1-SUM', 'CHANNEL-2-SUM', 'CHANNEL-3-SUM', 'SPIKES-SUM']
  table = []
  csv_export.append(header)
  for result in results:
    row = [
      result['name'],
      f"{result['channel-1']['sum-total']:,}",
      f"{result['channel-2']['sum-total']:,}",
      f"{result['channel-3']['sum-total']:,}",
      f"{result['spikes']['sum-total']:,}"
    ]
    table.append(row)
    csv_export.append(row)
  print(tabulate(table, headers=header, tablefmt='fancy_grid'))
  return csv_export

def saveHistogram_JSON(name, histogram):
  histogram_json = json.dumps(histogram_raw)
  with open(config['COMMON']['DIR_ARTIFACTS'] + '/' + histogram_name + '.json', 'w') as json_file:
    json.dump(histogram_json, json_file)
    print('created json: ' + histogram_name)

def saveHistogram_CSV(name, histogram):
  with open(config['COMMON']['DIR_ARTIFACTS'] + '/' + histogram_name + '.csv', 'w') as csv_file:
    wr = csv.writer(csv_file, dialect='excel')
    for pixel_count in histogram:
      wr.writerow([pixel_count])
    print('created csv: ' + histogram_name)

def getSpikeValues(histogram):
  spike_values = []
  for spike_index in config['HISTOGRAM']['SPIKES']:
    spike_values.append(histogram[spike_index])
  return spike_values

def splitHistogram(histogram, channel):
  return histogram[config['HISTOGRAM'][channel]['RANGE'][0]:config['HISTOGRAM'][channel]['RANGE'][1]]

def analyzeHistogram(histogram, name):
  h_channel_1 = splitHistogram(histogram, 'CHANNEL_1')
  h_channel_2 = splitHistogram(histogram, 'CHANNEL_2')
  h_channel_3 = splitHistogram(histogram, 'CHANNEL_3')
  h_spike_values = getSpikeValues(histogram)

  results = {
    'name': name,
    'channel-1': {
      'sum-total': sum(h_channel_1),
    },
    'channel-2': {
      'sum-total': sum(h_channel_2)
    },
    'channel-3': {
      'sum-total': sum(h_channel_3)
    },
    'spikes': {
      'sum-total': sum(h_spike_values)
    }
  }
  
  return results

if __name__ == '__main__':

  analysis_results = []
  raw_files = utils.getFiles(config['COMMON']['DIR_DATA'], config['COMMON']['FILE_EXTENSIONS'])

  for image_file in raw_files:
    im = Image.open(image_file['path'])
    histogram_raw = im.histogram()
    histogram_name = 'histogram-' + os.path.splitext(image_file['name'])[0]

    print('analyzing: ' + histogram_name)
    analysis = analyzeHistogram(histogram_raw, histogram_name)
    analysis_results.append(analysis)
    print('saving histogram: ' + histogram_name)
    saveHistogram_CSV(histogram_name, histogram_raw)
    saveHistogram_JSON(histogram_name, histogram_raw)
  
  csv_export = printResults(analysis_results)
  exportResults_CSV(csv_export)