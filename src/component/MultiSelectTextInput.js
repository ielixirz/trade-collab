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

  validateDuplicate = (value, input) => {
    if (this.props.handleDuplication) {
      const found = value.find(i => i.value === input);
      return found === undefined;
    }
    return true;
  };

  handleChange = (value) => {
    this.setState({ value });
    this.props.getValue([...value]);
  };

  handleInputChange = (inputValue) => {
    if (inputValue !== '') {
      this.setState({ inputValue });
    }
  };

  handleKeyDown = (event) => {
    const { inputValue, value } = this.state;
    if (!inputValue) return;
    // eslint-disable-next-line default-case
    switch (event.key) {
      case 'Backspace':
        if (inputValue.length === 1) {
          this.setState({ inputValue: '' });
        }
        break;
      case 'Enter':
      case 'Tab':
      case ' ':
        if (this.validateDuplicate(value, inputValue)) {
          if (this.props.handleDuplication) {
            this.props.duplicationCallback(false);
          }
          this.setState(
            {
              inputValue: '',
              value: [...value, createOption(inputValue)],
            },
            () => {
              this.props.getValue([...value, createOption(inputValue)]);
            },
          );
        } else {
          this.props.duplicationCallback(true);
        }
        event.preventDefault();
    }
  };

  handleClear = () => {
    this.setState({
      inputValue: '',
      value: [],
    });
  };

  handleLockInLastInput() {
    const { inputValue, value } = this.state;
    if (!inputValue) return;
    this.setState(
      {
        inputValue: '',
        value: [...value, createOption(inputValue)],
      },
      () => {
        this.props.getValue([...value, createOption(inputValue)]);
      },
    );
    // eslint-disable-next-line consistent-return
    return createOption(inputValue);
  }

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
