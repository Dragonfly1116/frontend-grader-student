import React from 'react';
import PropTypes from 'prop-types';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import { NavLink } from 'react-router-dom'

const styles = theme => ({
  menuItem: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& $primary, & $icon': {
        color: theme.palette.common.white,
      },
    },
  },
  primary: {},
  icon: {},
});

function NavigationBar(props) {
  const { classes } = props;

  return (
    <Paper>
      <MenuList>
        <NavLink to="/main" >
          <MenuItem className={classes.menuItem}>
            <ListItemText classes={{ primary: classes.primary }} inset primary="Home" />
          </MenuItem>
        </NavLink>
        <NavLink to="/admin/problem" >
          <MenuItem className={classes.menuItem}>
            <ListItemText classes={{ primary: classes.primary }} inset primary="Problem" />
          </MenuItem>
        </NavLink>
      </MenuList>
    </Paper>
  );
}

NavigationBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavigationBar);
