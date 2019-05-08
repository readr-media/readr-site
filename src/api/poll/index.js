import { constructUrlWithQuery, fetch, fetchInStrict, post, put } from 'src/api/comm'
import { getHost } from 'src/util/comm'
import { decamelizeKeys } from 'humps'

const host = getHost()

function fetchChosenChoices (params) {
  const url = constructUrlWithQuery(`${host}/api/polls/list/picks`, params)
  return fetchInStrict(url, {})
}

function fetchPublicPolls (params) {
  const url = constructUrlWithQuery(`${host}/api/public/polls`, params)
  return fetch(url)
}

function insertChosenChoice (params) {
  const url = `${host}/api/poll`
  return post(url, decamelizeKeys(params))
}

function updateChosenChoice (params) {
  const url = `${host}/api/poll`
  return put(url, decamelizeKeys(params))
}

export {
  fetchChosenChoices,
  fetchPublicPolls,
  insertChosenChoice,
  updateChosenChoice
}
