/* eslint-disable react/destructuring-assignment */
/* eslint-disable filenames/match-regex */
import React from 'react';
import moment from 'moment';
import { SingleDatePicker } from 'react-dates';
import './DatePicker.scss';

export default class DatePicker extends React.Component {
  state = {
    focused: false,
    date: moment(),
  };

  render() {
    return (
      <SingleDatePicker
        numberOfMonths={1}
        onDateChange={date => this.setState({ date })}
        onFocusChange={({ focused }) => this.setState({ focused })}
        focused={this.state.focused}
        date={this.state.date}
      />
    );
  }
}
