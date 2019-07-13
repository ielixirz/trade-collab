/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
import React, { useState, useEffect } from 'react';
import { Input } from 'reactstrap';
import Select from 'react-select';

const TurnAbleTextLabel = ({ text, turnType, data }) => {
  const [isTurn, setTurn] = useState(false);
  const [label, setLabel] = useState(text);
  const [turnComponent, setTurnComponent] = useState(text);

  const turn = () => {
    setTurn(!isTurn);
  };

  const INPUT_TYPE = data => (
    <Input
      type="text"
      id={data.id}
      placeholder={data.placeholder}
      onChange={(event) => {
        setLabel(event.target.value);
        if (data.onChangeFn !== null) {
          data.onChangeFn(event);
        }
      }}
      onKeyPress={(event) => {
        if (event.key === 'Enter') {
          if (data.onKeyPressFn !== null) {
            data.onKeyPressFn(event);
          }
          turn();
        }
      }}
    />
  );

  const DROPDOWN_TYPE = data => (
    <Select
      name={data.name}
      id={data.id}
      options={data.options}
      className="basic-multi-select"
      classNamePrefix="select"
      placeholder={data.placeholder}
      onChange={(input) => {
        setLabel(input.value.role);
        if (data.onChangeFn !== null) {
          data.onChangeFn(input);
        }
        turn();
      }}
      styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
      menuPortalTarget={document.body}
      menuPosition="fixed"
      menuPlacement="bottom"
    />
  );

  useEffect(() => {
    if (turnType === 'input') {
      setTurnComponent(INPUT_TYPE(data));
    } else if (turnType === 'dropdown') {
      setTurnComponent(DROPDOWN_TYPE(data));
    }
  }, [isTurn]);

  return (
    <div style={{ height: 25 }}>
      {isTurn ? (
        <span>{turnComponent}</span>
      ) : (
        <div style={{ height: '100%' }} role="button" onClick={turn} onKeyDown={null} tabIndex="-1">
          {text}
        </div>
      )}
    </div>
  );
};

export default TurnAbleTextLabel;
