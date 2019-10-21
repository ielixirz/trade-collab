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

  const getFileImgType = (extension) => {
    if (extension === 'PDF') {
      return 'PDF';
    }

    if (extension === 'XLS' || extension === 'XLSX' || extension === 'CSV') {
      return 'EXCEL';
    }

    if (extension === 'DOCX') {
      return 'WORD';
    }

    if (
      extension === 'PNG'
      || extension === 'JPG'
      || extension === 'GIF'
      || extension === 'BMP'
      || extension === 'TIFF'
      || extension === 'SVG'
    ) {
      return 'IMAGES';
    }
    return 'DEFAULT';
  };

  const getFileImg = (extension) => {
    const fileType = getFileImgType(extension);
    switch (fileType) {
      case 'PDF':
        return 'assets/img/file-pdf-regular.png';
      case 'EXCEL':
        return 'assets/img/file-excel-regular.png';
      case 'WORD':
        return 'assets/img/file-word-regular.png';
      case 'IMAGES':
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
      return `${newFileName}..${fileExt}`;
    }
    return fileName;
  };

  const openFile = (url) => {
    window.open(url, 'Download');
  };

  return (
    <Row
      className={selected ? 'file-row selected' : 'file-row'}
      onMouseOver={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onFocus={() => null}
      onClick={() => setSelected(!selected)}
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
            src={getFileImg(
              fileInfo.FileName.substr(fileInfo.FileName.lastIndexOf('.'), fileInfo.FileName.length)
                .toUpperCase()
                .replace('.', ''),
            )}
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
        {isHovering ? <FileCardButtonGroup downloadFn={() => openFile(fileInfo.FileUrl)} /> : ''}
      </Col>
    </Row>
  );
};

export default FileCard;
