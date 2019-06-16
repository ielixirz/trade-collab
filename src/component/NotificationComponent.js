import { DropdownItem } from 'reactstrap';
import React from 'react';
import { SetUserNotificationRead } from '../service/user/user';
import moment from 'moment';

export default ({ index, item, user, t, text }) => (
  <DropdownItem
    key={`notification${index}`}
    className={item.UserNotificationReadStatus ? '' : 'highlight'}
    onClick={() => {
      console.log('you has been click', item.id);
      SetUserNotificationRead(user, item.id);
      window.location.href = '#/network';
    }}
  >
    <div>
      <div className="message">
        <div className="pt-3 mr-3 float-left">
          <div className="avatar">
            <img src="https://img.icons8.com/ios/50/000000/user.png" className="img-avatar" />
          </div>
        </div>
        <div>
          <small className="text-muted" />
          <small className="text-muted float-right mt-1">
            {t.toDateString() === new Date().toDateString()
              ? 'Today'
              : moment(t).format('DD/MM/YY')}
            <br />
            {moment(t).format('hh:mm a')}
          </small>
        </div>

        <div className="small text-muted text-truncate">
          <p>{text}</p>
        </div>
      </div>
    </div>
  </DropdownItem>
);
