const sharp = require('sharp')
const tf = require('@tensorflow/tfjs')
const tfnode = require('@tensorflow/tfjs-node')

const Logger = require('../logger.js')
const logger = Logger.init()

const modelName = 'tumor-detector-2d'
const modelPath = `file://build/models/${modelName}/model.json`

const IMAGE_SIZE = 96
const CLASS_ENCODINGS = {
  'none': 0,
  'tumor': 1 
}

let model = null

const init = async () => {
  try {
    model = await tfnode.loadLayersModel(modelPath)
    logger.info(`model loaded: ${modelName}`)
  } catch (e) {
    logger.error(`model load error: ${modelName}`)
    logger.error(e)
  } 
}

const predict = async (imagePath) => {
  try {
    const imageProcessed = await sharp(imagePath)
      .resize({ width: IMAGE_SIZE, height: IMAGE_SIZE })
      .toBuffer()
    const imageTensor = tfnode.node.decodeImage(imageProcessed)
      .expandDims()
    return await model.predict(imageTensor)
              .array()
              .then((predictions) => { 
                const prediction = predictions[0]
                let classPrediction = []
                logger.info(classPrediction)
                let index = prediction.indexOf(Math.max(...prediction))
                let tumor = false
                if (index == 1) { tumor = true }
                return {
                  tumor: tumor,
                  confidence: prediction[index]
                }
              })
  } catch (err) {
    return {
      err: err
    }
  } 
}

module.exports = {
  init,
  predict
}



