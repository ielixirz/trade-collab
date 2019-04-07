import React, { useState, forwardRef, useRef, useImperativeHandle } from 'react'
import { Input, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import { PutFile, GetMetaDataFromStorageRefPath } from '../service/storage/managestorage';
import { CreateShipmentFile } from '../service/shipment/shipment';

const UploadModal = forwardRef((props, ref) => {
    const [modal, setModal] = useState(false)
    const [fileName, setFileName] = useState("-")
    const [file, setFile] = useState(null)
    const [shipmentKey, setShipmentKey] = useState(null)
    const [chatRoomKey, setChatRoomKey] = useState(null)
    const [message, setMessage] = useState("")

    const messageRef = useRef();

    const toggle = () => {
        setModal(!modal)
    };

    const upload = () => {
        if (file !== null) {
            let storageRefPath = `/Shipment/${shipmentKey}/${fileName}`;
            PutFile(storageRefPath, file);
            GetMetaDataFromStorageRefPath(storageRefPath).then((metaData) => {
                CreateShipmentFile(shipmentKey,
                    {
                        FileName: metaData.name,
                        FileUrl: metaData.fullPath,
                        FileCreateTimestamp: metaData.timeCreated,
                        FileOwnerKey: "mockKey",
                        FileStorgeReference: metaData.fullPath
                    }
                )
            })
        }
        toggle();
        props.sendMessage(chatRoomKey, shipmentKey, `${message} [ ${fileName} ]`);
        props.fetchFiles(shipmentKey);
    }

    useImperativeHandle(ref, () => ({

        triggerUploading(file, shipmentKey, chatRoomKey) {
            console.log(file)
            if (file !== undefined) {
                setFileName(file.name)
                setFile(file)
            }
            setChatRoomKey(chatRoomKey)
            setShipmentKey(shipmentKey)
            toggle();
        }

    }));

    const handleMessageChange = (event) => {
        setMessage(event.target.value)
    }

    return (
        <Modal isOpen={modal} toggle={toggle} className="upload-modal">
            <ModalHeader toggle={toggle}><b>Upload a file</b></ModalHeader>
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
                <Button color="primary" onClick={upload}>Upload</Button>{' '}
            </ModalFooter>
        </Modal>
    );
});

export default UploadModal
