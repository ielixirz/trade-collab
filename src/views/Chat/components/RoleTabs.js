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

const werehouse = require('./warehouse-solid.svg');

const styles = {
  display: 'inline-table',
  verticalAlign: 'top',
};
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
        <table className="table table-borderless">
          <tbody
            style={{
              fontSize: '0.9em',
              fontWeight: 'bold',
            }}
          >
            <tr>
              <td width={600}>
                {role}{' '}
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
              </td>
            </tr>
          </tbody>
        </table>
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
        <Steps current={1} vertical style={styles}>
          {role.map(item => {
            return this.renderRoleOption(item.value);
          })}
        </Steps>
      </div>
    );
  }
}

export default RoleTabs;
