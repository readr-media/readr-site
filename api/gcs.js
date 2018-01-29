const { GCP_KEYFILE, GCP_PROJECT_ID, GCP_PUBSUB_TOPIC_NAME } = require('./config')
const storage = require('@google-cloud/storage')
const PubSub = require('@google-cloud/pubsub')

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

const publishAction = (data) => {
  process.env['GOOGLE_APPLICATION_CREDENTIALS'] = GCP_KEYFILE
  const projectId = GCP_PROJECT_ID
  const pubsubClient = PubSub({
    projectId: projectId
  })
  const topicName = GCP_PUBSUB_TOPIC_NAME
  const topic = pubsubClient.topic(topicName)
  const publisher = topic.publisher()
  const dataBuffer = Buffer.from(JSON.stringify(data))
  publisher.publish(dataBuffer)
  .then((results) => {
    const messageId = results
    console.log(`Message ${messageId} published.`)
    return messageId
  })
  .catch((error) => {
    console.log(error)
  })
}

module.exports = {
	initBucket,
	makeFilePublic,
  uploadFileToBucket,
  deleteFileFromBucket,
  publishAction
}