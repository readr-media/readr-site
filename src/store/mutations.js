// import Vue from 'vue'

export default {
  SET_LOGGEIN_STATUS: (state, { status, body }) => {
    // console.log('body', body)
    state['isLoggedIn'] = body
  },
  SET_TOKEN: (state, { token, type }) => {
    switch (type) {
      case 'register':
        state['register-token'] = token
        break
    }
  },
  SET_MEMBERS: (state, { members }) => {
    state['members'] = members
  },
  SET_PROFILE: (state, { profile }) => {
    state['profile'] = profile
  }
}
