#!/usr/bin/python
import os
import json

def printConfig(config):
  print(json.dumps(config, indent=2))

def getFiles(dir, extensions):
  files = []
  for file in os.listdir(dir):
    if file.endswith(tuple(extensions)):
      files.append({
        'path': dir + '/' + file,
        'name': file
      })
  return(files)