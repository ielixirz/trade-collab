/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
import React, { Component } from 'react';

import CreatableSelect from 'react-select/lib/Creatable';

const components = {
  DropdownIndicator: null,
};

const createOption = label => ({
  label,
  value: label,
});

export default class MultiSelectTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      value: [],
      placeholder: props.placeholder,
    };
  }

  handleChange = (value) => {
    this.setState({ value });
    this.props.getValue({ value });
  };

  handleInputChange = (inputValue) => {
    this.setState({ inputValue });
  };

  handleKeyDown = (event) => {
    const { inputValue, value } = this.state;
    if (!inputValue) return;
    // eslint-disable-next-line default-case
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        this.setState(
          {
            inputValue: '',
            value: [...value, createOption(inputValue)],
          },
          () => {
            this.props.getValue([...value, createOption(inputValue)]);
          },
        );
        event.preventDefault();
    }
  };

  render() {
    const { inputValue, value, placeholder } = this.state;
    return (
      <CreatableSelect
        components={components}
        inputValue={inputValue}
        isClearable
        isMulti
        menuIsOpen={false}
        onChange={this.handleChange}
        onInputChange={this.handleInputChange}
        onKeyDown={this.handleKeyDown}
        placeholder={placeholder}
        value={value}
        className={this.props.className}
      />
    );
  }
}
