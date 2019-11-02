/* eslint-disable react/destructuring-assignment */
/* eslint-disable filenames/match-regex */
import React from 'react';
import moment from 'moment';
import { SingleDatePicker } from 'react-dates';
import './DatePicker.scss';
import firebase from 'firebase';
import { UpdateMasterData } from '../../../service/masterdata/masterdata';

const invalidStyle = {
  paddingLeft: 5,
  marginLeft: 8,
  border: '1px solid red',
  display: 'inline-block',
};

const normalStyle = {
  paddingLeft: 5,
  marginLeft: 8,
  border: '1px solid white',
  display: 'inline-block',
};

export default class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    console.log('Props', props);
    this.state = {
      focused: false,
      date: moment(),
      ...props,
    };
  }

  componentDidMount() {
    console.log(' if no value use default', this.state);
    if (this.props.value === '') {
      this.setState({ date: moment() });
    } else {
      try {
        this.setState({ date: moment(this.props.value) });
      } catch (e) {
        this.setState({ date: moment(this.props.value.seconds * 1000) });
      }
    }
  }

  render() {
    return (
      <div style={this.props.invalid[this.props.name] ? invalidStyle : normalStyle}>
        <SingleDatePicker
          numberOfMonths={1}
          daySize={30}
          onDateChange={(date) => {
            this.props.changeHandler(date, this.props.name);
            this.setState({ date });
          }}
          onFocusChange={({ focused }) => this.setState({ focused })}
          focused={this.state.focused}
          date={this.state.date || new Date()}
        />
      </div>
    );
  }
}
