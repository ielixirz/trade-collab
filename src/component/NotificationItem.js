import { DropdownItem } from 'reactstrap';
import React, { Component } from 'react';

export default ({ index, item, t, text }) => {
  return (
    <DropdownItem
      key={`notification${index}`}
      className={item.UserNotificationReadStatus ? '' : 'highlight'}
      onClick={() => {
        console.log('you has been click', item.id);
        window.location.href = '#/network';
      }}
    >
      <div>
        <div className="message">
          <div className="pt-3 mr-3 float-left">
            <div className="avatar">
              <img src={'https://img.icons8.com/ios/50/000000/user.png'} className="img-avatar" />
              <span className="avatar-status" />
            </div>
          </div>
          <div>
            <small className="text-muted"> </small>
            <small className="text-muted float-right mt-1">
              {t.toDateString() === new Date().toDateString() ? 'Today' : t.toDateString()}
            </small>
          </div>

          <div className="small text-muted text-truncate">
            <p>{text}</p>
          </div>
        </div>
      </div>
    </DropdownItem>
  );
};
