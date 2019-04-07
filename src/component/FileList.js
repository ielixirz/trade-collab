import React, { useEffect, useCallback } from 'react';
import { ListGroup, ListGroupItem, Row, Col } from 'reactstrap';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { GetShipmentFileList } from '../service/shipment/shipment';
import { map } from 'rxjs/operators';
import { FETCH_FILES } from '../constants/constants';

export default function FileList({ shipmentKey }) {
  const mapState = useCallback(
    state => ({
      collection: state.FileReducer
    }),
    []
  );
  console.log(shipmentKey);
  const dispatch = useDispatch();
  const fetchFiles = useCallback(shipmentKey => {
    GetShipmentFileList(shipmentKey)
      .pipe(map(docs => docs.map(d => d.data())))
      .subscribe({
        next: res => {
          dispatch({
            type: FETCH_FILES,
            id: shipmentKey,
            payload: res
          });
        },
        error: err => {
          console.log(err);
          alert(err.message);
        },
        complete: () => {}
      });
  }, shipmentKey);

  const props = useMappedState(mapState);

  useEffect(() => {
    const ShipmentKey = shipmentKey;
    fetchFiles(ShipmentKey);
  }, []);

  const { collection = [] } = props;
  return (
    <div>
      {collection.map((s, index) => {
        console.log(s);
        return (
          <ListGroup flush key={index}>
            <ListGroupItem disabled tag="a">
              <Row>
                <Col xs="1">
                  <i className="fa fa-file-picture-o" />
                </Col>
                <Col xs="11" className="text-left">
                  {s.FileName}
                </Col>
              </Row>
            </ListGroupItem>
          </ListGroup>
        );
      })}
    </div>
  );
}
