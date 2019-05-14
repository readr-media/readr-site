// import _ from 'lodash'
// // import Vue from 'vue'
// // import { POST_TYPE, } from 'api/config'

// import {
//   follow,
//   getFollowingByResource,
//   // getFollowingByUser,
// } from 'src/api'

// export default {
//   namespaced: true,
//   state () {
//     return {
//       byUser: [],
//       byResource: [],
//     }
//   },
//   mutations: {
//     SET_FOLLOWING_BY_RESOURCE (state, items) {
//       state.byResource = items
//     },
//   },
//   actions: {
//     FOLLOW ({}, { params, }) {
//       return new Promise((resolve, reject) => {
//         follow({ params, }).then(({ status, }) => {
//           if (status === 200) {
//             resolve()
//           }
//         }).catch(() => {
//           reject()
//         })
//       })
//     },

//     GET_FOLLOWING_BY_RESOURCE ({ commit, }, { resource = '', ids = [], } = {}) {
//       return getFollowingByResource({ resource,ids, }).then(({ status, body, }) => {
//         const items = _.get(body, 'items', []).map()
//       })
//     },
//   },
// }
