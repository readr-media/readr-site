/* eslint no-empty-pattern: 0 */
import _ from 'lodash'
import { getNotification, updateNotificationStatus } from 'src/api'

const GET_NOTIFICATION = ({ commit }, { id }) => {
  return getNotification(id).then(({ status, body }) => {
    if (status === 200) {
      commit('SET_NOTIFICATION', { items: _.get(body, 'items', []) })
    }
  })
}

const UPDATE_NOTIFICATION_STATUS = ({}, { params }) => {
  return updateNotificationStatus({ params })
}

export {
  GET_NOTIFICATION,
  UPDATE_NOTIFICATION_STATUS
}
