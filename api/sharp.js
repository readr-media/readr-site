const { IMAGE_UPLOAD_QUALITY_JPEG, IMAGE_UPLOAD_QUALITY_PNG } = require('./config')
const _ = require('lodash')
const fs = require('fs')
const moment = require('moment')
const sharp = require('sharp')


const resizeOpts = {
  post: [
    { target: 'mobile@4x', width: 1500 },
    { target: 'mobile@3x', width: 1200 },
    { target: 'mobile@2x', width: 800 },
    { target: 'tablet@2x', width: 2700 },
    { target: 'tablet@1x', width: 1000 },
    { target: 'desktop@2x', width: 3000 },
    { target: 'desktop@1x', width: 2000 }
  ],
  member: [
    { target: 'mobile@4x', width: 150 },
    { target: 'mobile@3x', width: 120 },
    { target: 'mobile@2x', width: 80 },
    { target: 'tablet@2x', width: 270 },
    { target: 'tablet@1x', width: 100 },
    { target: 'desktop@2x', width: 300 },
    { target: 'desktop@1x', width: 200 }
  ]
}

const processImage = (file, sourceType) => {
  const outputPaths = []
  return new Promise((resolve, reject) => {
    const filePath = file.path
    const fileName = sourceType === 'member' ? file.originalname : file.filename
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
        return image.toFile(`tmp/${timePrefix}-${fileName}.${fileFormat}`)
      })
      .then((data) => {
        outputPaths.push(`tmp/${timePrefix}-${fileName}.${fileFormat}`)
        console.log('-- processImage 1', outputPaths)
        // fs.unlink(filePath, (err) => {
        //   if (err) {
        //     console.error(`Error: delete ${filePath} fail`)
        //   }
        //   console.info(`successfully deleted ${filePath}`)
        //   return data
        // })
      })
      .then(() => {
        console.log('-- processImage 3', outputPaths)
        Promise.all(resizeOpts[sourceType].map((opt) => {
          image
            .jpeg({ quality: IMAGE_UPLOAD_QUALITY_JPEG, force: false })
            .png({ compressionLevel: IMAGE_UPLOAD_QUALITY_PNG, force: false })
            .resize(opt.width)
            .min()
            .withoutEnlargement()
            .toFile(`tmp/${timePrefix}-${fileName}-${opt.target}-${opt.width}.${fileFormat}`)
            .then(() => {
              console.log('-- processImage 4')
              return outputPaths.push(`tmp/${timePrefix}-${fileName}-${opt.target}-${opt.width}.${fileFormat}`)
            })
        }))
        .then(() => {
          console.log('-- processImage 5', outputPaths)
        })
        // Promise.all(resizeOpts[sourceType].map((opt) => {
        //   return image
        //     .jpeg({ quality: IMAGE_UPLOAD_QUALITY_JPEG, force: false })
        //     .png({ compressionLevel: IMAGE_UPLOAD_QUALITY_PNG, force: false })
        //     .resize(opt.width)
        //     .min()
        //     .withoutEnlargement()
        //     .toFile(`tmp/${timePrefix}-${fileName}-${opt.target}-${opt.width}.${fileFormat}`)
        //     .then(() => {
        //       outputPaths.push(`tmp/${timePrefix}-${fileName}-${opt.target}-${opt.width}.${fileFormat}`)
        //     })
        // }))
        // .then(() => {
        //   console.log('-- processImage 4', outputPaths)
        //   resolve(outputPaths)
        // })
      })

      // .then(() => {
      //   image
      //     .toFile(`tmp/${timePrefix}-${fileName}.${fileFormat}`)
      //     .then(() => {
      //       outputPaths.push(`tmp/${timePrefix}-${fileName}.${fileFormat}`)
      //       console.log('-- processImage 1', outputPaths)
      //       fs.unlink(filePath, (err) => {
      //         if (err) {
      //           console.error(`Error: delete ${filePath} fail`)
      //         }
      //         console.info(`successfully deleted ${filePath}`)
      //       })
      //     })
      // })
      // .then(() => {
      //   console.log('-- processImage 2', outputPaths)
      //   resizeOpts[sourceType].map((opt) => {
      //     return image
      //       .jpeg({ quality: IMAGE_UPLOAD_QUALITY_JPEG, force: false })
      //       .png({ compressionLevel: IMAGE_UPLOAD_QUALITY_PNG, force: false })
      //       .resize(opt.width)
      //       .min()
      //       .withoutEnlargement()
      //       .toFile(`tmp/${timePrefix}-${fileName}-${opt.target}-${opt.width}.${fileFormat}`)
      //       .then(() => {
      //         outputPaths.push(`tmp/${timePrefix}-${fileName}-${opt.target}-${opt.width}.${fileFormat}`)
      //       })
      //   })
      //   .then(() => {
      //     console.log('-- processImage 3', outputPaths)
      //     resolve(outputPaths)
      //   })
      // })
      .catch(err => {
        reject(err)
      })
  })
}

module.exports = {
  processImage
}
