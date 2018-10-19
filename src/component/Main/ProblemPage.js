import React from 'react'
import axios from 'axios'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom'

import AuthService from '../../utils/AuthService'
import Calculate from '../../utils/Calculate'
import { MenuItem,  Select, InputLabel} from '@material-ui/core'

const Auth = new AuthService()
const Cal = new Calculate()


const styles = theme => ({
    card: {
      maxWidth: 900,
      margin: 'auto',
      display: 'flex',
      flexWrap: 'wrap',
    },
    error: {
        color: 'red'
    },
    cardActionArea: {
        width: '100vw'
    },button: {
        margin: theme.spacing.unit
    },
})
class ProblemPage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            problem: null,
            fileUpload: null,
            link: null,
            selectedLanguage: '',
            submit: []
        }
    }

    componentDidMount() {
        this.getProblem()
    }
    componentWillReceiveProps(newProps) {
        this.props = newProps
        this.getProblem()
    }

    getProblem() {
        const { match } = this.props
        axios.get(`http://localhost:5000/api/problem/${match.params.problemName}`)
        .then(res => {
            this.setState({
                problem: res.data,
                link: `http://localhost:5000/uploads/${res.data.name}/${res.data.pdf}`,
                selectedLanguage: res.data.lang[0]
            })
        })
        .catch(err => console.log(err))
        axios.get(`http://localhost:5000/api/users/${Auth.getUser()}`)
            .then( ({data}) => {
                let x = []
                Object.values(data.submit).map( sb => {
                    if(sb.problem_name === match.params.problemName) {
                        x = x.concat([sb])
                    }
                })
                this.setState({
                    submit: x 
                })
            })
    }
    
    handleChange = e => {
        this.setState({
            fileUpload: e.target.files[0]
        })
    }

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit = e => {
        e.preventDefault()
        const { fileUpload, problem , selectedLanguage} = this.state
        if(!fileUpload) {
            this.setState({
                error: 'please select file before upload'
            })
            return;
        }
        if(selectedLanguage === '') {
            this.setState({
                error: 'please select language before upload'
            })
            return;
        }
        const data = {
            "number_of_runs": "1", 
            "cpu_time_limit": problem.time_limit.toString(),
            "cpu_extra_time": problem.extra_time.toString(),
            "wall_time_limit": problem.wall_time_limit.toString(),
            "memory_limit": problem.memory_limit.toString(),
            "stack_limit": problem.stack_limit.toString(),
            "max_processes_and_or_threads": problem.max_process.toString(),
            "enable_per_process_and_thread_time_limit": problem.process_time,
            "enable_per_process_and_thread_memory_limit": problem.process_memory,
            "max_file_size": problem.max_file_size.toString()
        }
        const submission = {
            name: problem.name,
            stdin: problem.stdin,
            stdout: problem.stdout,
            language: selectedLanguage,
            data: data
        }
        let Data = new FormData(this.refs.form)
        axios.post(`http://localhost:5000/api/problem/submitfile`,Data)
        .then(res => 
            {
                // Default Processing When Judge yet.
                const sb = {
                    email: Auth.getUser(),
                    problem_name: this.state.problem.name,
                    date: 'In Queued',
                    pass: false,
                    score: 'Processing',
                    time: 'Waiting',
                    memory: 'Waiting',
                    compile: null,
                    key: res.data.name
                }
                const ObjectData = {
                    file: res.data.name,
                    process: sb,
                    submission: submission
                }
                this.getProblem()
                axios.post('http://localhost:5000/api/problem/submission', ObjectData)
                .then( response => {
                    console.log(response)
                    this.getProblem()
                })
                .catch( err => {
                    console.log("error "+ err)
                })
            })
            .catch(err => console.log(err))
    }

    render() {
        const { classes } = this.props
        const { problem, submit} = this.state
        
        if(problem) {
            return (
                <div>
                    <Card className={classes.card}>
                        <CardActionArea className={classes.cardActionArea}>
                        <CardContent >
                            <Typography gutterBottom variant="h5" component="h2">
                                {problem.name}
                            </Typography>
                        </CardContent>
                        </CardActionArea>
                        { this.state.link && <object 
                            width="100%"
                            margin="10px"
                            height="680px"
                            data={this.state.link}></object>}
                        <CardActionArea className={classes.cardActionArea}>
                            <CardContent >
                            <Typography gutterBottom variant="h5" component="h2">
                                Hint: none
                            </Typography>
                            <Typography component="p">
                                {problem.name}
                            </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions>
                            {this.state.fileUpload &&
                            <CardActionArea>
                                <CardContent>File Name: {this.state.fileUpload.name}</CardContent>
                            </CardActionArea>}
                            {this.state.error &&
                            <CardActionArea>
                                <CardContent className={classes.error}>Error: {this.state.error}</CardContent>
                            </CardActionArea>}
                        </CardActions>
                            <div >
                            <form onSubmit={this.onSubmit} ref="form">
                                <InputLabel className={classes.button}>Language </InputLabel>
                                <Select
                                        value={this.state.selectedLanguage}
                                        onChange={this.onChange}
                                        inputProps={{
                                        name: 'selectedLanguage',
                                        }}>
                                        { problem.lang.map( lang => <MenuItem key={lang} value={lang}>{lang}</MenuItem>)}
                                </Select>
                                <input type="hidden" name="user" id="user" value={Auth.getUser()}/>
                                <input
                                    style={{display: 'none'}}
                                    name="submitfile"
                                    onChange={this.handleChange}
                                    id="submitfile"
                                    multiple
                                    type="file"
                                    />
                                <label htmlFor="submitfile">
                                    <Button variant="outlined" color="secondary" component="span" className={classes.button}>
                                    File Upload
                                    </Button>
                                </label>
                                <input
                                    style={{display: 'none'}}
                                    id="submit"
                                    type="submit"
                                    />
                                <label htmlFor="submit">
                                    <Button style={{float: 'right'}}variant="contained" color="primary" component="span" className={classes.button}>
                                    Submit
                                    </Button>
                                </label>
                            </form>
                            </div>
                        {/* </CardActions> */}
                        <CardActionArea className={classes.cardActionArea}>
                            { this.state.submit && Object.values(submit).map(sb => {
                                return (
                                    <CardContent >
                                        <Typography component="p">
                                            [{sb.score}] [{sb.time}] [{sb.memory}] [{sb.date    }]
                                        </Typography>
                                    </CardContent>
                                )
                            })}
                        </CardActionArea>
                        </Card>
                </div>
            )
        } 
        return (
            <h1>Loading...</h1>
        )
    }
}

export default withStyles(styles)(withRouter(ProblemPage));