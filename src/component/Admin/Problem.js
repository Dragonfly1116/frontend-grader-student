import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button'
import TagInputAuto from './TagsInputAuto'
import Divider from '@material-ui/core/Divider'

import axios from 'axios'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  input: {
    margin: theme.spacing.unit,
  },
  inputNONE: {
    margin: theme.spacing.unit,
    display: 'none',
  },  
  formControl: {
    margin: theme.spacing.unit,
  },
});

class Problem extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
          name: '',
          time_limit: 1,
          extra_time: 0.5,
          wall_time_limit: 5,
          memory_limit: 64000,
          stack_limit: 64000,
          max_process: 30,
          process_time: "true",
          process_memory: "true",
          max_file_size: 2048,
          lang: [],
          output: '',
          input: '',
          pdf:''
      }
  }

  onChange = e => {
      this.setState({
          [e.target.name]: e.target.value
      })
  }
  
  handleLangSelect = lang => {
      this.setState({
          lang
      })
  }

  handleFile = e => {
      const input = e.target
      if(input.name === 'pdf') {
        this.setState({
            [e.target.name]: input.files[0].name
        })
      } else {
        let listFile = '';
        Object.keys(input.files).map((file,index) => {
            listFile += input.files[file].name
            if(index !== input.files.length - 1) {
                listFile += ', '
            }
            return '' //Remove Warning 
        })
        this.setState({
            [e.target.name]: input.files.length + ' files : ' + listFile
        })
      }
  }

  onSubmit = e => {
      e.preventDefault()
    let Data = new FormData(this.refs.form)
    Data.append('lang',JSON.stringify(this.state.lang))
    axios.post('http://localhost:5000/api/problem', Data)
        .then(res => {console.log('success')})
        .catch(err => {console.log(err)})
  }

  render() {
    const languages = [{ name: 'C'},{ name: 'C++'},{ name: 'Java'}]
    const { classes } = this.props;
    return (
        <div className={classes.container}>
        <form onSubmit={this.onSubmit} ref="form">
            <TextField
                label="name"
                name="name"
                value={this.state.name}
                onChange={this.onChange}
                className={classes.input}
                helperText="ชื่อโจทย์"
                fullWidth
            />
            <FormControl fullWidth component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">PDF Problem File [{this.state.pdf}]</FormLabel>
            <div style={{marginTop: 10}}></div>
                <input
                    ref="forminput"
                    className={classes.inputNONE}
                    name="pdf"
                    id="pdf"
                    accept=".pdf"
                    onChange={this.handleFile}
                    type="file"
                />
                <label htmlFor="pdf">
                    <Button fullWidth variant="contained" color="secondary" component="span" className={classes.button}>
                     PDF Upload
                    </Button>
                </label>
            </FormControl>
            <TextField
                inputProps={{
                    min: 0.5,
                    max: 10,
                    step: 0.5
                }}
                style={{width: 100}}
                type="number"
                label="Time Limit"
                name="time_limit"
                value={this.state.time_limit}
                onChange={this.onChange}
                className={classes.input}
            />
            <TextField
                inputProps={{
                    min: 0,
                    max: 2,
                    step: 0.5
                }}
                style={{width: 100}}
                type="number"
                label="Extra Time"
                name="extra_time"
                value={this.state.extra_time}
                onChange={this.onChange}
                className={classes.input}
            />
            <TextField
                inputProps={{
                    min: 5,
                    max: 20,
                    step: 0.5
                }}
                style={{width: 200}}
                type="number"
                label="Wall Time Limit"
                name="wall_time_limit"
                value={this.state.wall_time_limit}
                onChange={this.onChange}
                className={classes.input}
            />
            <TextField
                inputProps={{
                    min: 0,
                    max: 256000
                }}
                fullWidth
                type="number"
                label="Memory Limit"
                name="memory_limit"
                value={this.state.memory_limit}
                onChange={this.onChange}
                className={classes.input}
            />
            <TextField
                inputProps={{
                    min: 0,
                    max: 128000
                }}
                style={{width: '30%'}}
                type="number"
                label="Stack Limit"
                name="stack_limit"
                value={this.state.stack_limit}
                onChange={this.onChange}
                className={classes.input}
            />
            <TextField
                inputProps={{
                    min: 1,
                    max: 30
                }}
                style={{width: '30%'}}
                type="number"
                label="Max Process"
                name="max_process"
                value={this.state.max_process}
                onChange={this.onChange}
                className={classes.input}
            />
            <TextField
                inputProps={{
                    min: 1024,
                    max: 4096
                }}
                style={{width: '30%'}}
                type="number"
                label="Max File Size"
                name="max_file_size"
                value={this.state.max_file_size}
                onChange={this.onChange}
                className={classes.input}
            />
            <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Enable Per Process Time Limit</FormLabel>
            <RadioGroup
                name="process_time"
                className={classes.group}
                value={this.state.process_time}
                onChange={this.onChange}
            >
                <FormControlLabel value="true" control={<Radio />} label="True" />
                <FormControlLabel value="false" control={<Radio />} label="False" />
            </RadioGroup>
            </FormControl>
            <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Enable Per Process Memory Limit</FormLabel>
            <RadioGroup
                name="process_memory"
                className={classes.group}
                value={this.state.process_memory}
                onChange={this.onChange}
            >
                <FormControlLabel value="true" control={<Radio />} label="True" />
                <FormControlLabel value="false" control={<Radio />} label="False" />
            </RadioGroup>
            </FormControl>
            <FormControl fullWidth component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Languages Allow</FormLabel>
            <div style={{marginTop: 10}}></div>
            <TagInputAuto languages={languages} handle={this.handleLangSelect}/>
            </FormControl>
            <FormControl fullWidth component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Input File [{this.state.input}]</FormLabel>
            <div style={{marginTop: 10}}></div>
                <input
                    accept=".in"
                    className={classes.inputNONE}
                    name="input"
                    onChange={this.handleFile}
                    id="input"
                    multiple
                    type="file"
                />
                <label htmlFor="input">
                    <Button variant="outlined" color="primary" component="span" className={classes.button}>
                     Input Upload
                    </Button>
                </label>
            </FormControl>
            <FormControl fullWidth component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Output File [{this.state.output}]</FormLabel>
            <div style={{marginTop: 10}}></div>
                <input
                    accept=".out"
                    className={classes.inputNONE}
                    name="output"
                    onChange={this.handleFile}
                    id="output"
                    multiple
                    type="file"
                />
                <label htmlFor="output">
                    <Button variant="outlined" color="secondary" component="span" className={classes.button}>
                     Output Upload
                    </Button>
                </label>
            </FormControl>
            <Divider />
            <br />
            <input
                className={classes.inputNONE}
                id="submit-button-file"
                type="submit"
            />
            <label htmlFor="submit-button-file">
                <Button style={{float: 'right'}}variant="contained" color="primary" component="span" className={classes.button}>
                 Submit
                </Button>
            </label>
        </form>
        </div>
    );
  }
}

Problem.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Problem);
