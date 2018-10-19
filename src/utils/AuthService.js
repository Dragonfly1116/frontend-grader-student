import jwt from 'jwt-decode'

export default class AuthService {
  
  getUser = () => {
    if(!this.checkAuth()) {
        return ''
    }
    const token = localStorage.getItem('token')
    const { email } = jwt(token)
    return email
  }

  getStatus = () => {
    if(!this.checkAuth()) {
        return ''
    }
    const token = localStorage.getItem('token')
    const { status } = jwt(token)
    return status
  }

  checkAuth = () => {
    const token = localStorage.getItem('token')
    if(!token || token === '') {
        return false;
    }
    try {
        const { exp } = jwt(token);
        if( exp < new Date().getTime()/1000) {
            return false;
        } else {
            return true;
        }
    } catch(err) {
        return false;
    }
  }

  Logout() {
      localStorage.removeItem('token')
      window.location = '/'
  }

}