const express = require('express')
const Multer = require('multer')

const Logger = require('../logger.js')
const logger = Logger.init()

const TumorDetector2D = require('../tf-models/tumor-detector-2d.js')
const app = express()

const multer = Multer({
	// storage: Multer.memoryStorage(),
	dest: 'files/',
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 mb max
  },
})

app.post('/analyze',  multer.single('image'), (req, res) => {
	
	if (!req.file) {
		logger.info('no file uploaded')
    return res.status(400).send({err: true})
	}

	const file = req.file

  TumorDetector2D.predict(file.path).then((result) => {

    if (result.err) {
      logger.error(result.err)
      return res.send({
        error: true,
        message: 'Server process failed'
      })
    }

    logger.info(result)
    return res.send(result)
    
  })
	
})

module.exports = app