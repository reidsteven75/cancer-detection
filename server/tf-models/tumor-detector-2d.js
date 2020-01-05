const pixels = require('image-pixels')
const sharp = require('sharp')
const tf = require('@tensorflow/tfjs')
const tfnode = require('@tensorflow/tfjs-node')

const modelName = 'tumor-detector-2d'
const modelPath = `file://build/models/${modelName}/model.json`

const IMAGE_SIZE = 96
const IMAGE_CHANNELS = 4 // RGB
let model = null

const init = async () => {
  try {
    model = await tf.loadLayersModel(modelPath)
    console.info(`model loaded: ${modelName}`)
  } catch (e) {
    console.error(`model load error: ${modelName}`)
    console.error(e)
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
    console.info(`classification: ${prediction}`)
  } catch (e) {
    console.error(`prediction error: ${modelName}`)
    console.error(e)
  } 
}

    // const imagePixels = await pixels(imageProcessed, {shape: [IMAGE_SIZE, IMAGE_SIZE]})
    // console.log('PIXELS')
    // console.log(imagePixels)
    // const imageTensor = tf.tensor3d(imagePixels.data, [IMAGE_SIZE, IMAGE_SIZE, IMAGE_CHANNELS])

module.exports = {
  init,
  predict
}



