import React, { useState, forwardRef, useRef, useImperativeHandle, useCallback } from 'react';
import { Input, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Select from 'react-select';
import { useMappedState, useDispatch } from 'redux-react-hook';
import { EditChatRoomFileLink } from '../service/chat/chat';
import _ from 'lodash';

const CopyModal = forwardRef((props, ref) => {
    const [modal, setModal] = useState(false);
    const [fileName, setFileName] = useState("-");
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [chatroomOption, setChatroomOption] = useState([]);
    const [copyChatroom, setCopyChatroom] = useState([]);

    const mapState = useCallback(
        state => ({
            chatrooms: state.ChatReducer.chatrooms
        }),
        []
    );

    const chatrooms = useMappedState(mapState);
    const messageRef = useRef();

    const toggle = () => {
        setModal(!modal);
    };

    const copy = () => {
        _.each(copyChatroom, (room) => {
            let copiedChatRoomFileLink = room.value.file;
            copiedChatRoomFileLink.push(file)
            EditChatRoomFileLink(room.value.shipmentKey, room.value.chatroomKey, copiedChatRoomFileLink)
        })
        toggle();
    }

    useImperativeHandle(ref, () => ({

        triggerCopying(chatFile) {
            if (chatFile !== undefined) {
                setFileName(chatFile.FileName)
                setFile(chatFile);
            }
            mapChatroom(chatrooms.chatrooms);
            toggle();
        }

    }));

    const mapChatroom = (chatrooms) => {
        let chatroomOption = []
        Object.keys(chatrooms).forEach(key => {
            if(key !== "custom"){
            let room = chatrooms[key];
            chatroomOption.push({
                value: {
                    shipmentKey: room.ShipmentKey,
                    chatroomKey: room.ChatRoomKey,
                    file: room.ChatRoomData.ChatRoomFileLink,

                },
                label: room.roomName
            });
            }
        });
        setChatroomOption(chatroomOption);
    }

    const handleMessageChange = (event) => {
        setMessage(event.target.value)
    }

    const handleChatroomSelectChange = (value) => {
        setCopyChatroom(value)
    }

    const preventParentCollapse = (e) => {
        e.stopPropagation();
    }

    return (
        <Modal isOpen={modal} toggle={toggle} className="upload-modal">
            <ModalHeader toggle={toggle}><b>Copy a file</b></ModalHeader>
            <ModalBody>
                {/* <Input
                    style={{ marginBottom: '0.5rem' }}
                    type="textarea"
                    name="textarea-input"
                    id="textarea-input"
                    rows="9"
                    placeholder="Add a message about the file"
                    ref={messageRef}
                    value={message}
                    onChange={handleMessageChange}
                /> */}
                <Label htmlFor="chatroom-copy" ><b>Copy to</b></Label>
                <Select
                    onChange={handleChatroomSelectChange}
                    onClick={preventParentCollapse}
                    isMulti
                    name="colors"
                    id="chatroom-copy"
                    options={chatroomOption}
                    className="basic-multi-select"
                    classNamePrefix="select"
                />
                <Label htmlFor="filename" style={{ marginTop: '0.5rem' }}><b>File name</b></Label>
                <Input
                    type="text"
                    id="filename"
                    placeholder=""
                    disabled
                    value={fileName}
                />
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={copy}>Copy</Button>{' '}
            </ModalFooter>
        </Modal>
    );

});


export default CopyModal;
