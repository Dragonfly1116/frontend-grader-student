import React from 'react'
import Autosuggest from 'react-autosuggest';
import './TagsInput.css'

class TagsInputAuto
 extends React.Component {
   constructor(props) {
     super(props);
     this.state = {
       tags: [],
       tagInput: '',
      suggestions: []
    };
  }
  
  languages = this.props.languages
  
  getSuggestionValue = suggestion => suggestion.name;

  renderSuggestion = suggestion => (
    <div>
      {suggestion.name}
    </div>
  );

  getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
  
    return inputLength === 0 ? [] : this.languages.filter(lang =>
      lang.name.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  onChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  onChangeSuggest = (e,{newValue}) => {
    this.setState({
      tagInput: newValue
    });
  };

  onKeyDown = e => {
    if(e.keyCode === 13 || e.keyCode === 32) {
      let {tagInput } = this.state
      const Pos = this.languages.map(e => e.name).indexOf(tagInput)
      if(Pos > -1) {
        this.addTags()
      }
    } 
  }

  addTags() {
    let {tagInput} = this.state
    tagInput = tagInput.trim()
    if(tagInput !== '') {
      if(!(this.state.tags.indexOf(tagInput) > -1)) {
        let tags = this.state.tags.concat([tagInput])
        this.updateTags(tags)
      }
      // this.updateTagInput('')
    }
  }

  updateTagInput(val) {
    if(val === ' ') {
      return;
    } else {
      this.setState({
        tagInput: val
      })
    }
  }

  removeTag = (e) => {
		let tags = this.state.tags.filter((tag) => tag !== e.target.id);
    this.updateTags(tags);
	}

	updateTags = (tags) => {
		this.setState({
      tags,
      tagInput: ''
    })
    this.props.handle(tags)
	}

  onSuggestionsFetchRequested = ({value}) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    })
  }
  
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    })
  }

  render() {
    const { tags, suggestions, value} = this.state;
    const inputProps = {
      placeholder: 'Type a programming language',
      value: this.state.tagInput,
      onChange: this.onChangeSuggest,
      className: "InputFormAuto",
      onKeyDown: this.onKeyDown
    };
    return (
      <div className="FormInputAuto">
        {tags && tags.map( (tag,index) => 
          <span className="Block" key={index} id={tag} onClick={this.removeTag}>{tag}</span>
        )}
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
        />
      </div>
      
    );
  }
}

export default TagsInputAuto
