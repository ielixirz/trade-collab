import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ListGroup, ListGroupItem, Row, Col } from 'reactstrap';
import {
  fetchFiles,
} from '../actions/fileActions';

class FileList extends Component {
  componentDidMount() {
    const ShipmentKey = this.props.shipmentKey;
    this.props.fetchFiles(ShipmentKey);
  }

  render() {
    const { collection = [] } = this.props;
    return (
      <div>
        {collection.map(s => {
          console.log(s)
          return (
            <ListGroup flush key={s.FileOwnerKey}>
              <ListGroupItem disabled tag="a"><Row>
                <Col xs="1"><i className="fa fa-file-picture-o"></i></Col>
                <Col xs="11" className="text-left">{s.FileName}</Col>
              </Row></ListGroupItem>
            </ListGroup>
          )
        })}
      </div>)
  }
}

const mapStateToProps = state => {
  return { collection: state.FileReducer }
}

export default connect(
  mapStateToProps,
  { fetchFiles }
)(FileList);
