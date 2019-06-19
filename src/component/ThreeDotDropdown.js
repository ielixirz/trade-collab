/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
import React, { useState } from 'react';
import {
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
} from 'reactstrap';
import _ from 'lodash';

const ThreeDotDropdown = ({ options, disable }) => {
  const [open, setOpen] = useState(false);

  const toggle = (e) => {
    e.stopPropagation();
    setOpen(!open);
  };

  return (
    <Dropdown toggle={toggle} isOpen={open}>
      <DropdownToggle style={{ background: 'white', border: '0' }}>
        <i className="fa fa-ellipsis-v" />
      </DropdownToggle>
      <DropdownMenu>
        {_.map(options, option => (option.function === undefined ? (
          <DropdownItem>{option.text}</DropdownItem>
        ) : (
          <DropdownItem disabled={disable} onClick={option.function}>
            {option.text}
          </DropdownItem>
        )))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default ThreeDotDropdown;
