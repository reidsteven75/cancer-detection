const pixels = require('image-pixels')
const tf = require('@tensorflow/tfjs')
require('@tensorflow/tfjs-node')

const modelName = 'tumor-detector-2d'
const modelPath = `file://build/models/${modelName}/model.json`

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
 
    console.log('PREDICT')
    const image = await pixels(imagePath)
    console.log('IMAGE')
    console.log(image)
    const tensorImage = new ImageData(image)

    

    // const prediction = await model.predict('dataset')
    // console.info(`prediction: ${modelName}`)
  } catch (e) {
    console.error(`prediction error: ${modelName}`)
    console.error(e)
  } 
}

module.exports = {
  init,
  predict
}



