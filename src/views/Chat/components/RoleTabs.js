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

const company = [
  { value: 'Jah Company', label: 'Jah Company' },
  { value: 'Fluke Company', label: 'Fluke Company' },
];
class RoleTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: [],
    };
    this.renderRoleOption = this.renderRoleOption.bind(this);
  }

  renderRoleOption = role => {
    return (
      <Row>
        <Col>
          <small>{role}</small>
        </Col>
        <Col>
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
    );
  };

  render() {
    const role = [
      { value: 'OutboundForwarder', label: 'OutboundForwarder' },
      { value: 'InboundForwarder', label: 'InboundForwarder' },
      { value: 'OutboundCustomBroker', label: 'OutboundCustomBroker' },
      { value: 'InboundCustomBroker', label: 'InboundCustomBroker' },
      { value: 'Exporter', label: 'Exporter' },
      { value: 'Importer', label: 'Importer' },
    ];

    return (
      <div>
        {role.map(item => {
          return this.renderRoleOption(item.value);
        })}
      </div>
    );
  }
}

export default RoleTabs;
