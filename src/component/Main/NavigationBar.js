import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { NavLink, withRouter} from 'react-router-dom'

import AuthService from '../../utils/AuthService'

const Auth = new AuthService()

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

const NavigationBar = props => {

  const { classes } = props;
  
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
            Student Grader
          <Typography variant="h6" color="inherit" className={classes.grow}>
          </Typography>
          <Button color="inherit">
            <NavLink to="/main" >Home</NavLink>
          </Button>
          <Button color="inherit">Task</Button>
          <Button color="inherit">Profile</Button>
          <Button onClick={Auth.Logout} color="inherit">Logout</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

NavigationBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavigationBar);
