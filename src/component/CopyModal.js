import React, { useState, forwardRef, useRef, useImperativeHandle, useCallback } from 'react';
import { Input, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { useMappedState, useDispatch } from 'redux-react-hook';
import { EditChatRoomFileLink } from '../service/chat/chat';

const CopyModal = forwardRef((props, ref) => {
    const [modal, setModal] = useState(false);
    const [fileName, setFileName] = useState("-");
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

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

    }

    useImperativeHandle(ref, () => ({

        triggerCopying(chatFile) {
            console.log(chatFile);
            console.log(chatrooms)
            if (chatFile !== undefined) {
                setFileName(chatFile.FileName)
                setFile(chatFile);
            }
            toggle();
        }

    }));

    const handleMessageChange = (event) => {
        setMessage(event.target.value)
    }

    return (
        <Modal isOpen={modal} toggle={toggle} className="upload-modal">
            <ModalHeader toggle={toggle}><b>Copy a file</b></ModalHeader>
            <ModalBody>
                <Input
                    type="textarea"
                    name="textarea-input"
                    id="textarea-input"
                    rows="9"
                    placeholder="Add a message about the file"
                    ref={messageRef}
                    value={message}
                    onChange={handleMessageChange}
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
