/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-date-picker';

const ShipmentInlineDate = ({
  updateHandle, id, initialValue, shipmentKey, field,
}) => {
  const [date, setDate] = useState(false);
  const [isInit, setIsInit] = useState(false);

  useEffect(() => {
    if (!isInit) {
      setDate(initialValue);
      setIsInit(true);
    }
  });

  const handleUpdate = (value) => {
    setDate(value);
    updateHandle(value, shipmentKey, field);
  };

  return (
    <DatePicker
      id={id}
      onChange={handleUpdate}
      onClick={(e) => {
        e.stopPropagation();
      }}
      value={date}
    />
  );
};

export default ShipmentInlineDate;
