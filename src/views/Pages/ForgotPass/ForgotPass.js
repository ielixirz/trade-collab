/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable filenames/match-regex */
import PropTypes from 'prop-types';
import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import '../../../component/MemberModal.css';
import './forgotpass.css';
import { Link } from 'react-router-dom';
import { ForgetPassword } from '../../../service/auth/manageuser';

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
      email: '',
      emailSend: true,
      mailNotfound: true,
    };

    this.toggle = this.toggle.bind(this);
  }

  complete = () => {
    this.toggle();
  };

  onChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { email, emailSend, mailNotfound } = this.state;
    ForgetPassword(email).subscribe({
      next: () => {
        this.setState({
          emailSend: !emailSend,
        });
      },
      complete: (result) => {
        console.log(result);
      },
      error: (err) => {
        console.log('err', err);
        this.setState({
          emailSend: !emailSend,
          mailNotfound: !mailNotfound,
        });
      },
    });
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

    const checkUserMail = this.state.mailNotfound ? (
      <div style={{ paddingLeft: 70, paddingRight: 70, paddingBottom: 40 }}>
        <h2 style={{ textAlign: 'left', margin: 0, paddingBottom: 20 }}>
          An email with reset password link has been sent to:
        </h2>
        <h2
          style={{
            textAlign: 'center',
            margin: 0,
            color: '#008489',
            paddingTop: 20,
          }}
        >
          {this.state.email}
        </h2>
        <p
          style={{
            textAlign: 'center',
            margin: 0,
            color: '#707070',
            paddingTop: 10,
            paddingBottom: 10,
          }}
        >
          *Note: Link will expired within 12 hours
        </p>
        <div className="col-sm-12 text-center">
          <Link to="/" style={{ color: '#fff' }}>
            <button className="button button2" type="submit">
              Back
            </button>
          </Link>
        </div>
      </div>
    ) : (
      <div style={{ paddingLeft: 70, paddingRight: 70, paddingBottom: 40 }}>
        <h2 style={{ textAlign: 'left', margin: 0, paddingBottom: 20 }}>Account not found for:</h2>
        <h2
          style={{
            textAlign: 'center',
            margin: 0,
            color: '#FF5A5F',
            paddingTop: 20,
            paddingBottom: 20,
          }}
        >
          {this.state.email}
        </h2>
        <div className="col-sm-12 text-center">
          <Link to="/" style={{ color: '#262626' }}>
            <button className="button button2" type="submit">
              Back
            </button>
          </Link>
        </div>
      </div>
    );
    return (
      <div>
        <div role="button" tabIndex={0} onClick={this.toggle}>
          {children}
        </div>
        <Modal isOpen={modal} toggle={this.toggle} style={{ paddingLeft: 20 }}>
          <ModalHeader toggle={this.toggle} close={closeBtn} />
          <ModalBody>
            {this.state.emailSend ? (
              <div style={{ paddingLeft: 70, paddingRight: 70, paddingBottom: 40 }}>
                <h2 style={{ textAlign: 'left', margin: 0, paddingBottom: 20 }}>Forgot Password</h2>
                <form onSubmit={this.onSubmit}>
                  <div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="please eneter your account email"
                      style={{ marginTop: 0 }}
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="col-sm-12 text-center">
                    <button className="forget-button button1" type="submit">
                      <span style={{ color: '#fff' }}>Reset Password</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              checkUserMail
            )}
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default ForgotPass;
