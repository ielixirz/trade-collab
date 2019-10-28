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
import globalIcon from '../../../component/svg/globalIcon';
import werehouse from '../../../component/svg/werehouse';
import {
  AssignShipmentRole,
  GetAllShipmentRole,
  GetShipmentDetail,
  GetShipmentRoleByCompany,
  RemoveShipmentRole,
} from '../../../service/shipment/shipment';
import Shipment from '../../Shipment/Shipment';
const timelogo = require('../../../component/svg/times-circle-regular-1.svg');

const styles = {
  display: 'inline-table',
  verticalAlign: 'top',
};
const company = [];
let role = [
  {
    value: 'OutboundForwarder',
    label: 'Forwarder Outbound',
    icon: globalIcon,

    index: 2,
  },
  {
    value: 'InboundForwarder',
    label: 'Forwarder Inbound',
    icon: globalIcon,
    index: 3,
  },
  {
    value: 'OutboundCustomBroker',
    label: 'Custom Broker Outbound',
    icon: policeIcon,
    index: 1,
  },
  {
    value: 'InboundCustomBroker',
    label: 'Custom Broker Inbound',
    icon: werehouse,
    index: 4,
  },
  { value: 'Exporter', label: 'Exporter', icon: Factory2, index: 0 },
  { value: 'Importer', label: 'Importer', icon: Factory2, index: 5 },
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
      ShipmentsRole: [],
      error: {
        isError: false,
        message: '',
      },
    };
    this.renderRoleOption = this.renderRoleOption.bind(this);
  }
  componentDidMount() {
    GetShipmentDetail(this.props.shipmentKey).subscribe({
      next: shipment => {
        console.log('Shipments', shipment.data(), this.props);
        const currentMember = _.get(
          shipment.data().ShipmentMember,
          this.props.userKey,
          {},
        );
        company.push({
          value: currentMember.ShipmentMemberCompanyKey,
          label: currentMember.ShipmentMemberCompanyName,
        });
      },
    });
    GetAllShipmentRole(this.props.shipmentKey).subscribe({
      next: e => {
        console.log('e', e);
        this.setState({ ShipmentsRole: e });
      },
    });
  }

  renderRoleIcon = (roleName, isGreen) => {
    return (
      <div className="Path-4121">
        <div style={iconStyle}>
          {_.find(role, item => item.value === roleName).icon(isGreen)}
        </div>
      </div>
    );
  };

  renderRoleOption = role => {
    const roleCard = _.find(
      this.state.ShipmentsRole,
      item => item.ShipmentRole === role.value,
    );
    return (
      <React.Fragment>
        <Row
          style={{
            marginBottom: '-20px',
          }}
        >
          <Col xs={'2'}>
            <br />
            {this.renderRoleIcon(role.value, roleCard)}
            {role.index !== 5 ? (
              <div className="progress-line-green" style={{ height: 30 }} />
            ) : (
              ''
            )}
          </Col>
          <Col xs={'8'}>
            {role.label}
            <br />

            {roleCard ? (
              roleCard.ShipmentRoleCompanyName
            ) : (
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
                        AssignShipmentRole(this.props.shipmentKey, role.value, {
                          ShipmentRoleCompanyKey: item.value,
                          ShipmentRoleCompanyName: item.label,
                        }).subscribe({
                          next: res => {
                            console.log('response', res);
                          },
                        });

                        this.setState({ company: item });
                      }}
                      className="shipment-item-box"
                    >
                      {item.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </UncontrolledDropdown>
            )}
          </Col>
          <Col>
            {roleCard ? (
              <a
                href={'#'}
                onClick={e => {
                  e.preventDefault();

                  console.log('click', {
                    input: this.props.shipmentKey,
                    role: role.value,
                    companykey: company[0].value,
                  });
                  GetShipmentRoleByCompany(
                    this.props.shipmentKey,
                    company[0].value,
                  ).subscribe({
                    next: result => {
                      console.log('GetShipmentRoleByCompany', result);
                    },
                  });
                  RemoveShipmentRole(
                    this.props.shipmentKey,
                    role.value,
                    company[0].value,
                  ).subscribe({
                    next: res => {
                      if (res) {
                        this.setState({
                          error: {
                            isError: true,
                            message: res,
                          },
                        });
                      }
                    },
                  });
                }}
              >
                {' '}
                <img
                  style={{
                    marginTop: '10px',
                  }}
                  src={timelogo}
                />
              </a>
            ) : (
              ''
            )}
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
        <br />
        {this.state.error.isError ? (
          <Row>
            <div className="alert alert-danger" role="alert">
              {this.state.error.message}
            </div>
          </Row>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default RoleTabs;
