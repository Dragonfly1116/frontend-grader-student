import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import axios from 'axios';
import AuthService from '../utils/AuthService'
import { Redirect } from 'react-router-dom'

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

class Login extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            email: "",
            password: "",
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

    clearField() {
        this.setState({
            email: '',
            password: '',
        })
    }

    onSubmit = e => {
        e.preventDefault();
        if(this.state.email === '' ||
           this.state.password === '') {
            this.setState({
                message: "Do not empty Field."
            })
        }
        else {
            axios.post('http://localhost:5000/auth/login', {
                email: this.state.email,
                password: this.state.password
            }).then( res => {
                if(res.status === 200) {
                    localStorage.setItem('token', res.data.token)
                    window.location = "/main"
                    this.clearField();
                } else {
                    this.setState({
                        message: res.data.message
                    })
                }
            }).catch( err => { this.setState({ message: "Auth Failed"}) })
        }
    }
    
    render() {
        const { classes } = this.props;
        if(this.state.redirect) {
            return <Redirect to="/main" />
        }
        return (
            <main className={classes.layout}>
                <div className={classes.alert}>
                    <Typography variant="title" color="error">{this.state.message}</Typography>
                </div>
                <Paper className={classes.paper}>
                <Typography variant="title" color="primary">Login</Typography>
                <form onSubmit={this.onSubmit} className={classes.form}>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel>Email Address</InputLabel>
                        <Input value={this.state.email} id="email" autoFocus onChange={this.onChangeHandle} />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <Input value={this.state.password} type="password" id="password" onChange={this.onChangeHandle} />
                    </FormControl>
                    <Button type="submit" size="small" fullWidth variant="raised" color="primary" className={classes.submit}>
                        Login
                    </Button>
                    <Button href="/register" size="small" fullWidth variant="outlined" color="primary" className={classes.submit}>
                        Register
                    </Button>
                </form>
                </Paper>
            </main>
        );
    }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);
