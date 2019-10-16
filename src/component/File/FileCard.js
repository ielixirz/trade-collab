/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
import React, { useState } from 'react';
import { Row, Col, Input } from 'reactstrap';

const FileCard = ({ fileInfo }) => {
  const [mode, setMode] = useState(false);
  const [selected, setSelected] = useState(false);

  return (
    <Row className="file-row">
      {/* <span style={fileListDateStyle}>
        {moment(new Date(s.FileCreateTimestamp)).format('D-M-YYYY HH:mm:ss')}
      </span> */}
      {mode === 'DELETE' ? (
        // TO-DO DELETE MODE RENDERER
        <div />
      ) : (
        <Col xs="1">
          <svg
            id="icon_file-text"
            data-name="icon/file-text"
            xmlns="http://www.w3.org/2000/svg"
            width="9.818"
            height="12"
            viewBox="0 0 9.818 12"
          >
            {' '}
            <path
              id="Combined-Shape"
              d="M11.727,5.364H9a.545.545,0,0,1-.545-.545V2.091H4.636a.545.545,0,0,0-.545.545v8.727a.545.545,0,0,0,.545.545h6.545a.545.545,0,0,0,.545-.545v-6h.545a.546.546,0,0,0,.5-.758.553.553,0,0,1,.043.212v6.545A1.636,1.636,0,0,1,11.182,13H4.636A1.636,1.636,0,0,1,3,11.364V2.636A1.636,1.636,0,0,1,4.636,1H9a.545.545,0,0,1,.386.16l3.273,3.273a.545.545,0,0,1,.118.177Zm-2.182-2.5v1.41h1.41ZM10.091,7a.545.545,0,0,1,0,1.091H5.727A.545.545,0,0,1,5.727,7Zm0,2.182a.545.545,0,0,1,0,1.091H5.727a.545.545,0,1,1,0-1.091ZM6.818,4.818a.545.545,0,0,1,0,1.091H5.727a.545.545,0,1,1,0-1.091Z"
              transform="translate(-3 -1)"
              fill="#3b3b3b"
            />
            {' '}
          </svg>
        </Col>
      )}
      <Col
        style={{ cursor: 'pointer', fontSize: 14, fontWeight: 'bold' }}
        xs="7"
        className="text-left"
      >
        {fileInfo.FileName}
      </Col>
      <Col xs="4" style={{ left: '10px' }} />
    </Row>
  );
};

export default FileCard;
