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
  PermissionRemoveList,
  RemoveShipmentRole,
} from '../../../service/shipment/shipment';
import Shipment from '../../Shipment/Shipment';
import BlockUi from 'react-block-ui';
import { GetUserCompany } from '../../../service/user/user';
const timelogo = require('../../../component/svg/times-circle-regular-1.svg');

const styles = {
  display: 'inline-table',
  verticalAlign: 'top',
};
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
      companyList: [],
      ShipmentsRole: [],
      isWorking: false,
      error: {
        isError: false,
        message: '',
      },
    };
    this.renderRoleOption = this.renderRoleOption.bind(this);
  }
  componentDidMount() {
    console.log('Set Listener', {
      ...this.props,
    });
    PermissionRemoveList(
      this.props.shipmentKey,
      this.props.memberData.ShipmentMemberCompanyKey,
    ).subscribe({
      next: res => {
        console.log('res', res);
      },
    });

    GetUserCompany(this.props.userKey).subscribe({
      next: res => {
        console.log('User Company is', res);
        const company = _.map(res, item => {
          return {
            value: item.CompanyKey,
            label: item.CompanyName,
          };
        });
        this.setState({
          companyList: company,
        });
      },
    });
    GetAllShipmentRole(this.props.shipmentKey).subscribe({
      next: e => {
        console.log('e', e);
        this.setState({ ShipmentsRole: e });
      },
      complete: e => {
        this.setState({
          isWorking: false,
        });
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
    const { companyList: company } = this.state;
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
                        this.setState({
                          isWorking: true,
                        });
                        const assign = AssignShipmentRole(
                          this.props.shipmentKey,
                          role.value,
                          {
                            ShipmentRoleCompanyKey: item.value,
                            ShipmentRoleCompanyName: item.label,
                          },
                        ).subscribe({
                          next: res => {
                            this.setState({
                              error: {
                                isError: false,
                                message: '',
                              },
                            });

                            assign.unsubscribe();
                          },
                          complete: () => {
                            this.setState({
                              isWorking: false,
                            });
                          },
                        });
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
                  this.setState({
                    isWorking: true,
                  });
                  const remove = RemoveShipmentRole(
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
                      } else {
                        this.setState({
                          error: {
                            isError: false,
                            message: '',
                          },
                        });
                      }
                    },
                    error: err => {
                      if (err) {
                        this.setState({
                          error: {
                            isError: true,
                            message: err.message,
                          },
                        });
                        this.setState({
                          isWorking: false,
                        });
                      }
                    },
                    complete: () => {
                      this.setState({
                        isWorking: false,
                      });
                      remove.unsubscribe();
                    },
                  });
                }}
              >
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
        <BlockUi tag="div" blocking={this.state.isWorking}>
          {role.map(item => {
            return this.renderRoleOption(item);
          })}
          <br />
        </BlockUi>
        <div
          style={{
            marginTop: 50,
          }}
        >
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
      </div>
    );
  }
}

export default RoleTabs;
