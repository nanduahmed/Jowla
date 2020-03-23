
export function login(state = [], action) {
    switch (action.type) {
      case 'ADD_LOGIN_DETAILS':
        const user = action.values.user;
        const token = action.values.token;
        return { ...state, token, user }
      default:
        return state
    }
  }