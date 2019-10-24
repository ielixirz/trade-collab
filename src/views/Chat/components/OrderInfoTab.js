import React, { Component } from 'react';
import { CardBody, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

class OrderInfoTab extends Component {
  render() {
    console.log('Data', this.props);
    return (
      <div>
        <Row>
          <div className="callout callout-info">
            <Row>
              <table className="table table-borderless">
                <tbody
                  style={{
                    textAlign: 'right',
                    fontSize: '0.9em',
                    fontWeight: 'bold',
                  }}
                >
                  <tr>
                    <td width={400}>
                      Port ETD : 02 Jan 2010
                      <br />
                      <small>Port , Country</small>
                    </td>
                    <td width={200}>
                      Quality Fresh
                      <br />
                      <small>Shipper</small>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Row>
          </div>
        </Row>
        <Row>
          <div className="callout callout-danger">
            <Row>
              <table className="table table-borderless">
                <tbody
                  style={{
                    textAlign: 'right',
                    fontSize: '0.9em',
                    fontWeight: 'bold',
                  }}
                >
                  <tr>
                    <td width={400}>
                      Port ETA : 02 Jan 2010
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
                      Last free day : 02 Jan 2010
                      <br />
                      Est. Delivery : 02 Jan 2010
                    </td>
                  </tr>
                </tbody>
              </table>
            </Row>
          </div>
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
