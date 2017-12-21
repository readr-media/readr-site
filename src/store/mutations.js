import Vue from 'vue'

export default {
  SET_TOKEN: (state, { token, type }) => {
    switch (type) {
      case 'register': 
        state['register-token'] = token
        break
    }
  }
}
