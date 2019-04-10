import React, { useEffect, useState, useCallback } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import _ from 'lodash';

const ThreeDotDropdown = (props) => {
    const [open, setOpen] = useState(false);

    const toggle = () => {
        setOpen(!open)
    }

    return (
        <Dropdown toggle={toggle} isOpen={open}>
            <DropdownToggle style={{ background: 'white', border: '0' }}>
                <i className="fa fa-ellipsis-v" />
            </DropdownToggle>
            <DropdownMenu>
                {
                    _.map(props.options, (option) => {
                        return (
                            option.function === undefined ?
                                <DropdownItem>{option.text}</DropdownItem>
                                :
                                <DropdownItem onClick={option.function}>{option.text}</DropdownItem>
                        )
                    })
                }
            </DropdownMenu>
        </Dropdown>
    );
};

export default ThreeDotDropdown
