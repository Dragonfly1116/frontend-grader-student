import React from 'react'
import './index.css'
import { BrowserRouter as Router, Route, withRouter} from 'react-router-dom'
import Main from './Main'
import Login from './Login.js'
import Register from './Register.js'
import NavigationBar from './NavigationBar.js'
import PrivateRoute from '../utils/PrivateRoute.js'
import CssBaseline from '@material-ui/core/CssBaseline'
import UserNavigionBar from './Main/NavigationBar.js'
import AuthService from '../utils/AuthService.js'
import PropTypes from 'prop-types'
import axios from 'axios'

import Admin from './Admin/index'

axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

const Auth = new AuthService()

class App extends React.Component {
    constructor(props) {
        super(props)
    }
    
    isLoggedIn() {
        return Auth.checkAuth()
    }

    render() {
        const { location } = this.props
        return (
            <div>
                <CssBaseline />
                    <div>
                         {
                        (location.pathname.match(new RegExp('^\/admin'))) 
                        ?
                        <Route path="/admin" component={Admin} />
                        :
                            this.isLoggedIn() ? 
                            <Route path="/" component={UserNavigionBar} /> 
                            : 
                            <Route path="/" component={NavigationBar} />
                        }
                        <Route exact path="/" component={Login} />
                        <Route exact path="/register" component={Register} />
                        <PrivateRoute path="/main" component={Main} />
                    </div>
            </div>
        )
    }
}

// App.propTypes = {
//     location: PropTypes.object.isRequired
// };

export default withRouter(App)