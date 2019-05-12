/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable filenames/match-regex */
import PropTypes from 'prop-types';
import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import '../../../component/MemberModal.css';

class ForgotPass extends React.Component {
  static propTypes = {
    children: PropTypes.any,
  };

  static defaultProps = {
    children: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    };

    this.toggle = this.toggle.bind(this);
  }

  setInput = (field, value) => this.setState({ [field]: value });

  complete = () => {
    this.toggle();
  };

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  render() {
    const { children } = this.props;
    const { modal } = this.state;
    const closeBtn = (
      <button className="close" onClick={this.toggle} type="submit">
        &times;
      </button>
    );
    return (
      <div>
        <div role="button" tabIndex={0} onClick={this.toggle}>
          {children}
        </div>
        <Modal isOpen={modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle} close={closeBtn} />
          <ModalBody>
            <div style={{ paddingLeft: 70, paddingRight: 70, paddingBottom: 40 }}>
              <h2 style={{ textAlign: 'center', margin: 0 }}>Forgot Password</h2>

              <form>
                <div>
                  <h4>Firstname</h4>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="please eneter your account&email"
                    style={{ marginTop: 0 }}
                    onChange={() => {}}
                  />
                </div>
              </form>
              <div className="col-sm-12 text-center">
                <button className="button button1" type="submit" onClick={this.submit}>
                  <span style={{ color: '#fff' }}>Reset Password</span>
                </button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default ForgotPass;
