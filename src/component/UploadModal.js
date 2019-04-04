import React, { useState, useEffect } from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

export default UploadModal = ({ file }) => {
    const [modal, setModal] = useState(false)

    const toggle = () => {
        setModal(!modal)
    };

    useEffect(() => {
        console.log(file)
    });

    return (
        <Modal isOpen={modal} toggle={toggle} className="upload-modal">
            <ModalHeader toggle={toggle}>Uploading: {file.name}</ModalHeader>
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
}
