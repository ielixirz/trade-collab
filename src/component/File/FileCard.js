/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
import React, { useState } from 'react';
import { Row, Col } from 'reactstrap';
import moment from 'moment';
import FileCardButtonGroup from './FileCardButtonGroup';
import './FileCard.scss';

const FileCard = ({ fileInfo, mode, progress }) => {
  const [selected, setSelected] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const getFileImg = (extension) => {
    switch (extension) {
      case 'PDF':
        return 'assets/img/file-pdf-regular.png';
      case 'XLS' || 'CSV':
        return 'assets/img/file-excel-regular.png';
      case 'DOCX':
        return 'assets/img/file-word-regular.png';
      case 'JPG' || 'PNG' || 'JPEG' || 'GIF' || '.BMP' || '.TIFF' || '.SVG':
        return 'assets/img/file-image-regular.png';
      default:
        return 'assets/img/file-any-other-type.png';
    }
  };

  const trimFileName = (fileName) => {
    if (fileName.length > 21) {
      const lastIndex = fileName.lastIndexOf('.');
      const subFileName = fileName.substr(0, lastIndex);
      const fileExt = fileName.substr(lastIndex, fileName.length);
      const newFileName = subFileName.substring(0, 20);
      return `${newFileName}...${fileExt}`;
    }
    return fileName;
  };

  return (
    <Row
      className="file-row"
      onMouseOver={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onFocus={() => null}
    >
      <div
        className="file-upload-progress"
        style={{ width: progress === 100 ? '97.5%' : `${progress}%` }}
      />
      {mode === 'DELETE' ? (
        // TO-DO DELETE MODE RENDERER
        <div />
      ) : (
        <Col xs="1.5" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <img
            style={{
              marginLeft: 7,
              marginTop: 5,
            }}
            src="assets/img/file-any-other-type.png"
            alt=""
            height="30"
            width="22.5"
          />
        </Col>
      )}
      <Col
        style={{
          marginLeft: 10,
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: 'bold',
        }}
        xs="6"
        className="text-left"
      >
        <Row>{trimFileName(fileInfo.FileName)}</Row>
        <Row style={{ fontSize: 10, color: '#808080' }}>
          {fileInfo.Uploader === undefined ? 'Unknown' : fileInfo.Uploader}
          {' '}
-
          {' '}
          {moment(new Date(fileInfo.FileCreateTimestamp)).format('D MMM YYYY HH:mm')}
        </Row>
      </Col>
      <Col xs="4" style={{ left: '10px', paddingLeft: 0 }}>
        {isHovering ? <FileCardButtonGroup /> : ''}
      </Col>
    </Row>
  );
};

export default FileCard;
