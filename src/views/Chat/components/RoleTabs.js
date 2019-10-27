import React, { Component } from 'react';
import {
  Button,
  CardBody,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  UncontrolledDropdown,
} from 'reactstrap';

import Select from 'react-select';
import _ from 'lodash';
import { Steps } from 'rsuite';
import DatePicker from './DatePicker';
import Factory2 from '../../../component/svg/Factory2';
import policeIcon from '../../../component/svg/policeIcon';

const werehouse = require('./warehouse-solid.svg');

const styles = {
  display: 'inline-table',
  verticalAlign: 'top',
};
const company = [
  { value: 'Jah Company', label: 'Jah Company' },
  { value: 'Fluke Company', label: 'Fluke Company' },
];
let role = [
  {
    value: 'OutboundForwarder',
    label: 'Forwarder Outbound',
    icon: Factory2(true),
    index: 2,
  },
  {
    value: 'InboundForwarder',
    label: 'Forwarder Inbound',
    icon: Factory2(true),
    index: 3,
  },
  {
    value: 'OutboundCustomBroker',
    label: 'Custom Broker Outbound',
    icon: policeIcon(true),
    index: 1,
  },
  {
    value: 'InboundCustomBroker',
    label: 'Custom Broker Inbound',
    icon: Factory2(true),
    index: 4,
  },
  { value: 'Exporter', label: 'Exporter', icon: Factory2(true), index: 0 },
  { value: 'Importer', label: 'Importer', icon: Factory2(true), index: 5 },
];
role = _.orderBy(role, ['index'], ['asc']);

const iconStyle = {
  marginTop: 5,
};
class RoleTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: [],
    };
    this.renderRoleOption = this.renderRoleOption.bind(this);
  }
  renderRoleIcon = roleName => {
    return (
      <div className="Path-4121">
        <div style={iconStyle}>
          {_.find(role, item => item.value === roleName).icon}
        </div>
      </div>
    );
  };

  renderRoleOption = role => {
    return (
      <React.Fragment>
        <Row
          style={{
            marginBottom: '-20px',
          }}
        >
          <Col xs={'2'}>
            <br />
            {this.renderRoleIcon(role.value)}
            {role.index !== 5 ? (
              <div className="progress-line-green" style={{ height: 30 }} />
            ) : (
              ''
            )}
          </Col>
          <Col xs={'8'}>
            {role.label}
            <br />
            <UncontrolledDropdown>
              <DropdownToggle tag={'p'}>
                <Select
                  className={'companySelect'}
                  onChange={e => {
                    this.setState({ role: e });
                  }}
                  name="company"
                  placeholder="Select Company"
                  options={company}
                  value={this.state.role[role]}
                  isDisabled={true}
                />
              </DropdownToggle>

              <DropdownMenu
                modifiers={{
                  setMaxHeight: {
                    enabled: true,
                    order: 890,
                    fn: data => {
                      return {
                        ...data,
                        styles: {
                          ...data.styles,
                          overflow: 'auto',
                          maxHeight: 500,
                        },
                      };
                    },
                  },
                }}
              >
                <DropdownItem disabled className="shipment-header">
                  Share shipping with people in
                </DropdownItem>

                {_.map(company, item => (
                  <DropdownItem
                    onClick={() => {
                      this.setState({ company: item });
                    }}
                    className="shipment-item-box"
                  >
                    {item.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </UncontrolledDropdown>
          </Col>
        </Row>
      </React.Fragment>
    );
  };

  render() {
    return (
      <div>
        {role.map(item => {
          return this.renderRoleOption(item);
        })}
      </div>
    );
  }
}

export default RoleTabs;
