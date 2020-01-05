const sharp = require('sharp')
const tf = require('@tensorflow/tfjs')
const tfnode = require('@tensorflow/tfjs-node')

const Logger = require('../logger.js')
const logger = Logger.init()

const modelName = 'tumor-detector-2d'
const modelPath = `file://build/models/${modelName}/model.json`

const IMAGE_SIZE = 96

let model = null

const init = async () => {
  try {
    model = await tf.loadLayersModel(modelPath)
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
    const prediction = await model.predict(imageTensor)
    logger.info(`classification: ${prediction}`)
    console.log(prediction.array)
    return {
      tumor: true,
      confidence: 0.98
    }
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



