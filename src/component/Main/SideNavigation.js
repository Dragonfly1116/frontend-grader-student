import React from 'react';
import PropTypes from 'prop-types';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import { NavLink,BrowserRouter as Router } from 'react-router-dom'
import Divider from '@material-ui/core/Divider'

import axios from 'axios'

import AuthService from '../../utils/AuthService'

const Auth = new AuthService()

const styles = theme => ({
  menuItem: {
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      '& $primary, & $icon': {
        color: theme.palette.common.white,
      },
    },
  },
  noprogress: {
    backgroundColor: '#bdbdbd',
    '&:hover': {
      backgroundColor: '#838383',
    }
  }
  ,
  pass: {
    backgroundColor: '#00ce00',
    '&:hover': {
      backgroundColor: '#089808',
    }
  },
  fail: {
    backgroundColor: '#e31f1f',
    '&:hover': {
      backgroundColor: '#b60000',
    }
  }
});


class NavigationBar extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      problemList: []
    }
  }
  
  componentDidMount() {
    axios.get('http://localhost:5000/api/problem')
    .then( ({data}) => this.setState({
      problemList: data
    })
    )
      .catch(err => {console.log(err)})
    const user = Auth.getUser()
    if(user !== '' && user) { 
      axios.get(`http://localhost:5000/api/users/${user}`)
        .then( res => {
          for(let pg in res.data.progress) {
            const temp = res.data.progress[pg].problem_name
            this.setState({
              [temp]: res.data.progress[pg].pass ? 'true': 'false'
            })
          }
        })
    }
  }

  render() {
    const { classes } = this.props
    const { problemList } = this.state

    const MENU =
      Object.values(problemList).map( problem => {
        let x
        if(this.state[problem.name]) {
          x = (this.state[problem.name] === 'true') ? classes.pass : classes.fail
        } else {
          x = classes.noprogress
        }
          return (<NavLink to={`/main/${problem.name}`} key={problem._id} >
            <MenuItem className={x}>
              {problem.name}
            </MenuItem>
          </NavLink>)
        
        })
    return (
      <Paper>
        <MenuList>
          <NavLink to="/main" >
            <MenuItem className={classes.menuItem}>
              Home
            </MenuItem>
          </NavLink>
          <Divider />
          {MENU}
        </MenuList>
      </Paper>
    );
  }
}

NavigationBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavigationBar);
