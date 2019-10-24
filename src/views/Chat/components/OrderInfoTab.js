import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';

class OrderInfoTab extends Component {
  render() {
    console.log('Data', this.props);
    return (
      <div className="callout callout-info">
        <Row>
          <Col md={1} />
          <Col md={'auto'}>
            <table className="table table-borderless">
              <tbody>
                <tr>
                  <td>Port ETD : 02 Jan 2010</td>
                  <td style={{ textAlign: 'right' }}>Otto</td>
                </tr>
                <tr>
                  <td>Jacob</td>
                  <td>Thornton</td>
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>
      </div>
    );
  }
}

export default OrderInfoTab;
