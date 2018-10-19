import React from 'react'
import { BrowserRouter as Router, Route} from 'react-router-dom'
import Problem from './Problem'

class AdminRouter extends React.Component {

    render() {
        return (
            <div>
                <Route exact path="/admin/problem" component={Problem} />
            </div>
        )
    }

}
export default AdminRouter