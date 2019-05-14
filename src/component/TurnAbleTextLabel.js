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
        data.onChangeFn(event);
      }}
      onKeyPress={(event) => {
        if (event.key === 'Enter') {
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
        data.onChangeFn(input);
        turn();
      }}
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
    <span>
      {isTurn ? (
        <span>{turnComponent}</span>
      ) : (
        <span role="button" onClick={turn} onKeyDown={null} tabIndex="-1">
          {label}
        </span>
      )}
    </span>
  );
};

export default TurnAbleTextLabel;
