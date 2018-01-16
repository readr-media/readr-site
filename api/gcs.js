const { GCP_KEYFILE, GCP_PROJECT_ID } = require('./config')
const storage = require('@google-cloud/storage')

const initBucket = (bucket) => {
  const gcs = storage({
    projectId: GCP_PROJECT_ID,
    keyFilename: GCP_KEYFILE,
  })

	return gcs.bucket(bucket);
}

const makeFilePublic = (bucketFile) => {
	return new Promise((resolve, reject) => {
		bucketFile.makePublic()
		.then(() => { resolve(bucketFile) })
		.catch(err => { reject(err) })
	})
}

const uploadFileToBucket = (bucket, filePath, options) => {
  return new Promise((resolve, reject) => {
		const opts = options || {}
		const bucketFile = bucket.file(opts.destination)
		const metadata = {}
		
    if (opts.filetype) {
      metadata.contentType = opts.filetype
    }
       
    if (opts.cacheControl) {
        metadata.cacheControl = opts.cacheControl
    }

		bucket.upload(filePath, options)
		.then(() => { resolve(bucketFile) })
		.catch(err => { reject(err) })
	})
}

const deleteFileFromBucket = (bucket, options) => {
  return new Promise((resolve, reject) => {
    const opts = options || {}
		const bucketFile = bucket.file(opts.destination)
		
		bucketFile.delete()
		.then(() => { resolve(bucketFile) })
		.catch(err => { reject(err) })
	})
}

module.exports = {
	initBucket,
	makeFilePublic,
  uploadFileToBucket,
  deleteFileFromBucket
}