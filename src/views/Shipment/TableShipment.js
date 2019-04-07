import React from 'react';
import { Table } from 'reactstrap';

export default class TableShipment extends React.Component {
  render() {
    return (
      <Table size="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>ref</th>
            <th>seller</th>
            <th>buyer</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Larry</td>
            <td>the Bird</td>
            <td>@twitter</td>
          </tr>
          https://devahoy.com/posts/introduction-to-react-hook/
        </tbody>
      </Table>
    );
  }
}
