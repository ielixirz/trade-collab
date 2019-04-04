import React, { useState, useEffect, forwardRef, useRef, useImperativeHandle } from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import { PutFile } from '../../service/storage/managestorage';

export default UploadModal = forwardRef((props, ref) => {
    const [modal, setModal] = useState(false)
    const [fileName, setFileName] = useState("-")
    const [file, setFile] = useState(null)

    const toggle = () => {
        setModal(!modal)
    };

    const upload = () => {
        PutFile(`/Shipment/${ShipmentKey}/${file.name}`, file);
    }

    useImperativeHandle(ref, () => ({

        triggerUploading(file) {
            setFileName(file.name)
            setFile(file)
            toggle();
        }

    }));

    return (
        <Modal isOpen={modal} toggle={toggle} className="upload-modal">
            <ModalHeader toggle={toggle}>Uploading: {fileName}</ModalHeader>
            <ModalBody>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore
                et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                culpa qui officia deserunt mollit anim id est laborum.
                  </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={toggle}>Upload</Button>{' '}
                <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
});
