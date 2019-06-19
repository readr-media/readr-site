import _ from 'lodash'
import {
  getNotification,
  updateNotificationStatus
} from 'src/api'

export default {
  namespaced: true,
  state () {
    return {
      notification: []
    }
  },
  mutations: {
    SET_NOTIFICATION (state, { items }) {
      state['notification'] = items
    }
  },
  actions: {
    GET_NOTIFICATION ({ commit }, id) {
      return getNotification(id).then(({ status, body }) => {
        if (status === 200) {
          const items = _.get(body, 'items', [])
          const itemsToObject = items.map(item => JSON.parse(item))
          const itemsAddOrder = itemsToObject.map((item, index) => {
            item.order = index
            return item
          })
          commit('SET_NOTIFICATION', { items: itemsAddOrder })
        }
      })
    },
    // eslint-disable-next-line no-empty-pattern
    UPDATE_NOTIFICATION_STATUS ({}, { params }) {
      return updateNotificationStatus({ params })
    }
  }
}
