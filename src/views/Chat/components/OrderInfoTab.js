import React, { Component } from 'react';
import { CardBody, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import { Steps } from 'rsuite';
import 'react-dates/initialize';
import DatePicker from './DatePicker';
import 'react-dates/lib/css/_datepicker.css';

const factoryLogo = require('./factoryLogo.svg');
const werehouse = require('./warehouse-solid.svg');

const styles = {
  display: 'inline-table',
  verticalAlign: 'top',
};
class OrderInfoTab extends Component {
  render() {
    console.log('Data', this.props);
    return (
      <div>
        <Row>
          <Steps current={1} vertical style={styles}>
            <Steps.Item
              icon={<img src={factoryLogo} />}
              title={
                <table className="table table-borderless">
                  <tbody
                    style={{
                      fontSize: '0.9em',
                      fontWeight: 'bold',
                    }}
                  >
                    <tr>
                      <td width={400}>
                        Port ETA : <DatePicker />
                        <br />
                        <small>Port , Country</small>
                      </td>
                      <td width={200}>
                        Fluke Company
                        <br />
                        <small>Consignee</small>
                      </td>
                    </tr>
                    <tr>
                      <td width={400}>
                        Last free day : <DatePicker />
                        <br />
                        Est. Delivery : <DatePicker />
                      </td>
                    </tr>
                  </tbody>
                </table>
              }
            />
            <Steps.Item
              icon={<img src={werehouse} />}
              title={
                <table className="table table-borderless">
                  <tbody
                    style={{
                      fontSize: '0.9em',
                      fontWeight: 'bold',
                    }}
                  >
                    <tr>
                      <td width={400}>
                        Port ETA : <DatePicker />
                        <br />
                        <small>Port , Country</small>
                      </td>
                      <td width={200}>
                        Fluke Company
                        <br />
                        <small>Consignee</small>
                      </td>
                    </tr>
                    <tr>
                      <td width={400}>
                        Last free day : <DatePicker />
                        <br />
                        Est. Delivery : <DatePicker />
                      </td>
                    </tr>
                  </tbody>
                </table>
              }
            />
          </Steps>
        </Row>

        <Row>
          <Form
            style={{
              width: '100%',
            }}
          >
            <FormGroup>
              <Label htmlFor="Product">Product</Label>
              <Input
                type="text"
                id="Product"
                placeholder="Young Fresh Coconut"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="Details">
                Details <i className="fa fa-lock fa-lg mt-4" />
              </Label>
              <Input type="text" id="Details" placeholder="Detail" />
            </FormGroup>
          </Form>
        </Row>
      </div>
    );
  }
}

export default OrderInfoTab;
