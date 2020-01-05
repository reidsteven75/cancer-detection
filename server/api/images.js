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
		res.status(400).send({err: true});
		logger.info('no file uploaded')
    return;
	}

	const metadata = req.body
	const file = req.file

	TumorDetector2D.predict(file.path)

	setTimeout(() => {
		return res.send({tumor: false})
		// return res.send({
		// 	error: true,
		// 	message: 'Server Failed'
		// })
	}, 2000)
	
})

module.exports = app