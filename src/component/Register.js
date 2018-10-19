import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {Redirect} from 'react-router-dom'
import withStyles from '@material-ui/core/styles/withStyles';
import axios from 'axios'

import AuthService from '../utils/AuthService'

const Auth = new AuthService()

const styles = theme => ({
  layout: {
    width: 'auto',
    display: 'block',
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  alert: {
    marginTop: theme.spacing.unit * 1,
    display: 'block',
    padding: '10px'
  },
  paper: {
    marginTop: theme.spacing.unit * 3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class Register extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            email: "",
            password: "",
            comfirmpassword: "",
            name: "",
            message: "",
            redirect: false
        }
    }

    componentDidMount() {
        if(Auth.checkAuth()) {
            this.setState({
                redirect: true
            })
        }
    }
    
    onChangeHandle = e => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    onSubmit = () => {
        if(this.state.email === '' ||
           this.state.password === '' ||
           this.state.confirmpassword === '' ||
           this.state.name === '' ) {
            this.setState({
                message: "Do not emptyField."
            })
        }
        else if(this.state.password !== this.state.confirmpassword) {
            this.setState({
                message: "Confirm Password is not correct!"
            })
        } else {
            axios.post('http://localhost:5000/api/users/', {
                email: this.state.email,
                password: this.state.password,
            name: this.state.name
            }).then( res => {
                if(res.status === 200) {
                    window.location = "/"
                } else {
                    this.setState({
                        message: "Register Fail."
                    })
                }
            })
        }
    }
    
    render() {
        const { classes } = this.props;

        if(this.state.redirect) return <Redirect to="/main" />

        return (
            <main className={classes.layout}>
                <div className={classes.alert}>
                    <Typography variant="title" color="error">{this.state.message}</Typography>
                </div>
                <Paper className={classes.paper}>
                <Typography variant="title" color="primary">Register</Typography>
                <form className={classes.form}>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel>Email Address</InputLabel>
                        <Input id="email" autoFocus onChange={this.onChangeHandle} />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel>Password</InputLabel>
                        <Input type="password" id="password" onChange={this.onChangeHandle} />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel>Confirm Password</InputLabel>
                        <Input type="password" id="confirmpassword" onChange={this.onChangeHandle} />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel>Name</InputLabel>
                        <Input id="name" onChange={this.onChangeHandle} />
                    </FormControl>
                    <Button onClick={this.onSubmit} size="small" fullWidth variant="raised" color="primary" className={classes.submit}>
                        Register
                    </Button>
                    <Button href="/" size="small" fullWidth variant="outlined" color="primary" className={classes.submit}>
                        Back
                    </Button>
                </form>
                </Paper>
            </main>
        );
    }
}

Register.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Register);
