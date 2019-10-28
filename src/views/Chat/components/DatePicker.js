/* eslint-disable react/destructuring-assignment */
/* eslint-disable filenames/match-regex */
import React from 'react';
import moment from 'moment';
import { SingleDatePicker } from 'react-dates';
import './DatePicker.scss';
import firebase from 'firebase';
import { UpdateMasterData } from '../../../service/masterdata/masterdata';

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
        this.setState({ date: moment(this.props.value.seconds * 1000) });
      } catch (e) {
        this.setState({ date: moment() });
      }
    }
  }

  render() {
    return (
      <SingleDatePicker
        numberOfMonths={1}
        daySize={30}
        onDateChange={(date) => {
          this.setState({ date });

          UpdateMasterData(this.props.shipmentKey, 'DefaultTemplate', {
            [this.props.name]: firebase.firestore.Timestamp.fromDate(date.toDate()),
          }).subscribe(() => {});
        }}
        onFocusChange={({ focused }) => this.setState({ focused })}
        focused={this.state.focused}
        date={this.state.date || firebase.firestore.Timestamp.now()}
      />
    );
  }
}
