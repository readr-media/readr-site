const { IMAGE_UPLOAD_QUALITY_JPEG, IMAGE_UPLOAD_QUALITY_PNG } = require('./config')
const _ = require('lodash')
const fs = require('fs')
const moment = require('moment')
const sharp = require('sharp')


const resizeOpts = [
  { target: 'mobile@4x', width: 1500 },
  { target: 'mobile@3x', width: 1200 },
  { target: 'mobile@2x', width: 800 },
  { target: 'tablet@2x', width: 2700 },
  { target: 'tablet@1x', width: 1000 },
  { target: 'desktop@2x', width: 3000 },
  { target: 'desktop@1x', width: 2000 }
]

const processImage = (file) => {
  const outputPaths = []
  return new Promise((resolve, reject) => {
    const filePath = file.path
    const fileName = file.filename
    const timePrefix = moment().unix()
    const image = sharp(filePath)
    let fileFormat
    image
      .metadata()
      .then((metadata) => {
        fileFormat = metadata.format
        if (fileFormat === 'jpeg') {
          fileFormat = 'jpg'
        }
        image
          .toFile(`tmp/${timePrefix}-${fileName}.${fileFormat}`)
          .then(() => {
            outputPaths.push(`tmp/${timePrefix}-${fileName}.${fileFormat}`)
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error(`Error: delete ${filePath} fail`)
              }
              console.info(`successfully deleted ${filePath}`)
            })
          })
      })
      .then(() => {
        Promise.all(resizeOpts.map((opt) => {
          return image
            .jpeg({ quality: IMAGE_UPLOAD_QUALITY_JPEG, force: false })
            .png({ compressionLevel: IMAGE_UPLOAD_QUALITY_PNG, force: false })
            .resize(opt.width)
            .min()
            .withoutEnlargement()
            .toFile(`tmp/${timePrefix}-${fileName}-${opt.target}-${opt.width}.${fileFormat}`)
            .then(() => {
              outputPaths.push(`tmp/${timePrefix}-${fileName}-${opt.target}-${opt.width}.${fileFormat}`)
            })
        }))
        .then(() => {
          resolve(outputPaths)
        })
      })
      .catch(err => {
        reject(err)
      })
  })
}

module.exports = {
	processImage
}
