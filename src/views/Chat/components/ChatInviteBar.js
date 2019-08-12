/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
import React, { useState } from 'react';
import { Row, Col, Button } from 'reactstrap';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import _ from 'lodash';
import { CreateChatMultipleInvitation } from '../../../service/join/invite';
import { GetUserInfoFromEmail } from '../../../service/user/user';
import { isValidEmail } from '../../../utils/validation';
import { CreateNonUserInvite } from '../../../service/inviteNonSystemUser/inviteNonSystemUser';
import { AddDay } from '../../../utils/date';

const ChatInviteBar = ({
  toggleInvite,
  chatRoomKey,
  shipmentKey,
  sender,
  member,
  shipmentData,
}) => {
  const [displayEmail, setDisplayEmail] = useState([]);
  const [emails, setEmails] = useState([]);
  const [notExistEmails, setNotExistEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const isExistingMember = (invited) => {
    const found = _.find(member, m => invited === m.ChatRoomMemberEmail);
    if (found) {
      return true;
    }
    return false;
  };

  const processInvitedEmail = (email) => {
    GetUserInfoFromEmail(email).subscribe((data) => {
      if (data.length > 0) {
        if (!isExistingMember(email)) {
          setEmails([...emails, { Email: email, isExist: true, isMarkRemove: false }]);
          setDisplayEmail([
            ...displayEmail,
            { Email: email, isExist: true, dataIndex: emails.length },
          ]);
        } else {
          // TO-DO alert warning for existing member
        }
      } else {
        setNotExistEmails([
          ...notExistEmails,
          { Email: email, isExist: false, isMarkRemove: false },
        ]);
        setDisplayEmail([
          ...displayEmail,
          { Email: email, isExist: false, dataIndex: emails.length },
        ]);
      }
    });
  };

  const handleEmailInputChange = (tags) => {
    const inputTag = tags[tags.length - 1];
    if (isValidEmail(inputTag)) {
      processInvitedEmail(inputTag);
    }
  };

  const handleEmailInputRemove = (index, dataIndex, isExist) => {
    if (isExist) {
      const removedEmail = [...emails];
      removedEmail[dataIndex].isMarkRemove = true;
      setEmails(removedEmail);
    } else {
      const removedEmail = [...notExistEmails];
      removedEmail[dataIndex].isMarkRemove = true;
      setNotExistEmails(removedEmail);
    }
    const removedDisplayEmail = [...displayEmail];
    removedDisplayEmail.splice(index, 1);
    setDisplayEmail(removedDisplayEmail);
  };

  const invite = () => {
    // Send Existing User Invites
    const inviteData = _.filter(emails, e => e.isMarkRemove === false);
    const result = CreateChatMultipleInvitation(inviteData, shipmentKey, chatRoomKey, sender);
    result.subscribe({
      next: (res) => {
        toggleInvite();
      },
    });

    // Send Not-Existing User Invites
    const recruiter = {
      CompanyInvitationRecruiterUserKey: sender.uid,
      CompanyInvitationRecruiterProfileKey: sender.id,
      CompanyInvitationRecruiterProfileFirstName: sender.ProfileFirstname,
      CompanyInvitationRecruiterProfileSurName: sender.ProfileSurname,
      CompanyInvitationRecruiterCompanyName:
        shipmentData.ShipmentMember[sender.uid].ShipmentMemberCompanyName === undefined
          ? ''
          : shipmentData.ShipmentMember[sender.uid].ShipmentMemberCompanyName,
      CompanyInvitationRecruiterCompanyKey:
        shipmentData.ShipmentMember[sender.uid].ShipmentMemberCompanyKey === undefined
          ? ''
          : shipmentData.ShipmentMember[sender.uid].ShipmentMemberCompanyKey,
    };
    _.forEach(notExistEmails, (email) => {
      if (!email.isMarkRemove) {
        CreateNonUserInvite({
          ShipmentKey: shipmentKey,
          ShipmentProductName: '',
          ShipmentReferenceID: '',
          ChatRoomKey: chatRoomKey,
          NonUserInviteType: 'Shipment',
          NonUserInviteEmail: email.Email,
          NonUserInviteRecruiterUserKey: recruiter.CompanyInvitationRecruiterUserKey,
          NonUserInviteRecruiterProfileKey: recruiter.CompanyInvitationRecruiterProfileKey,
          NonUserInviteRecruiterProfileFirstName:
            recruiter.CompanyInvitationRecruiterProfileFirstName,
          NonUserInviteRecruiterProfileSurName: recruiter.CompanyInvitationRecruiterProfileSurName,
          NonUserInviteRecruiterCompanyName: recruiter.CompanyInvitationRecruiterCompanyName,
          NonUserInviteRecruiterCompanyKey: recruiter.CompanyInvitationRecruiterCompanyKey,
          NonUserInviteExpiryDate: AddDay(new Date(), 28).toDate(),
        });
      }
    });
    if (inviteData.length === 0) {
      toggleInvite();
    }
  };

  const tagRenderer = (props) => {
    const {
      tag,
      key,
      disabled,
      onRemove,
      classNameRemove,
      getTagDisplayValue,
      className,
      ...other
    } = props;
    return (
      <span
        key={key}
        className={
          tag.isExist
            ? 'react-tagsinput-tag chat-invite exist'
            : 'react-tagsinput-tag chat-invite notExist'
        }
        {...other}
      >
        {getTagDisplayValue(tag.Email)}
        {!disabled && (
          <a
            className={classNameRemove}
            onClick={e => handleEmailInputRemove(key, tag.dataIndex, tag.isExist)}
          />
        )}
      </span>
    );
  };

  return (
    <React.Fragment>
      <Col xs={0.5} style={{ marginTop: 15 }}>
        <span>To: </span>
      </Col>
      <Col xs={6} style={{ height: 50, marginTop: 5 }}>
        <TagsInput
          value={displayEmail}
          onChange={handleEmailInputChange}
          inputProps={{
            className: 'react-tagsinput-input',
            placeholder: 'Input email address',
          }}
          renderTag={tagRenderer}
        />
      </Col>
      <Col xs={2}>
        <Row>
          <Button
            style={{ marginLeft: 22, height: 38 }}
            onClick={() => {
              invite();
            }}
            disabled={displayEmail.length < 1}
          >
            Invite
          </Button>
          <i
            style={{ margin: 0 }}
            className="cui-circle-x icons font-2xl d-block mt-4 cancel-invite"
            onClick={() => {
              toggleInvite();
            }}
            onKeyDown={null}
            tabIndex="-1"
            role="button"
          />
        </Row>
      </Col>
      <Col xs={1} />
      <Col xs={1} />
      <Col xs={1} />
    </React.Fragment>
  );
};

export default ChatInviteBar;
