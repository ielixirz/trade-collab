// eslint-disable-next-line filenames/match-regex
import React, { Component } from 'react';
import {
  Button,
  Col,
  Container,
  DropdownItem,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from 'reactstrap';
import './alert.css';
// eslint-disable-next-line react/prefer-stateless-function
class Alert extends Component {
  render() {
    let notification = [
      {
        id: 1,
        text: 'Holy.Wisdom has request to join Liam Produce',
        time: new Date(),
        isRead: false,
        sender: 'John',
        type: 'Shipment',
        avatar:
          'https://firebasestorage.googleapis.com/v0/b/yterminal-b0906.appspot.com/o/Profile%2F2sYaYykLYOd5a2D4FPbV%2F1556806598505Screen%20Shot%202562-04-29%20at%2023.54.33.png?alt=media&token=eda3cf62-d247-45dd-97c5-e7c9022a00bb',
        ShipmentKey: 'i5SXjeRcWWLMGd9m4bcg'
      },
      {
        id: 2,
        text: 'Pooh.Elixir has been invite to join Importer Chatroom',
        time: new Date(),
        isRead: true,
        sender: 'Pooh',
        type: 'Chat',
        avatar:
          'https://scontent.fbkk22-2.fna.fbcdn.net/v/t1.0-9/46491975_2461706807202990_8323584076334235648_n.jpg?_nc_cat=103&_nc_eui2=AeGn67viBaYidmrn_yWeMaX6AMBuov3nYmk0a3llhOLDSXB7ZkYqVOfdhs4ccrLKPCWRey-jjR1i4_oRS7MShnX_GA8CHblXrqXXsouL8Cb7yA&_nc_ht=scontent.fbkk22-2.fna&oh=c2ace08edac9ee9b9fda8bb7632da8c1&oe=5D6A9D95',

        ShipmentKey: 'i5SXjeRcWWLMGd9m4bcg'
      },
      {
        id: 3,
        text: 'John_Lee_J.Lee_skytex.com_has_requested_to_join_Y-Terminal_Co._Ltd.',
        time: new Date(),
        isRead: false,
        type: 'Shipment',
        sender: 'Pooh',
        avatar:
          'https://scontent.fbkk22-2.fna.fbcdn.net/v/t1.0-9/46491975_2461706807202990_8323584076334235648_n.jpg?_nc_cat=103&_nc_eui2=AeGn67viBaYidmrn_yWeMaX6AMBuov3nYmk0a3llhOLDSXB7ZkYqVOfdhs4ccrLKPCWRey-jjR1i4_oRS7MShnX_GA8CHblXrqXXsouL8Cb7yA&_nc_ht=scontent.fbkk22-2.fna&oh=c2ace08edac9ee9b9fda8bb7632da8c1&oe=5D6A9D95',
        ShipmentKey: 'i5SXjeRcWWLMGd9m4bcg'
      }
    ];
    return (
      <div
        className="animated fadeIn"
        style={{
          marginTop: '10vh'
        }}
      >
        {notification.map((item, index) => {
          return (
            <div className="container">
              <a
                href="#"
                onClick={e => {
                  e.preventDefault();
                }}
              >
                <Row className="notification">
                  <div className={item.isRead ? 'notificationItem' : 'notificationItem highlight'}>
                    <div className="pt-3 mr-3 float-left">
                      <div className="avatar">
                        <img src={item.avatar} className="img-avatar" />
                        <span className="avatar-status badge-success" />
                      </div>
                    </div>
                    <div>
                      <small className="text-muted">{item.sender}</small>
                      <small className="text-muted float-right mt-1">
                        {item.time.toLocaleString()}
                      </small>
                    </div>

                    <div className="small text-muted text-truncate">{item.text}</div>
                  </div>
                </Row>
              </a>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Alert;
