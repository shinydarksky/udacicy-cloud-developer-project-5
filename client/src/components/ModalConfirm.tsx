import React, { Component } from 'react'
import {  Confirm } from 'semantic-ui-react'

class ModalConfirm extends Component<any, any> {


    render() {
        const { isOpen, onClose, onConfirm }: any = this.props

        return (
            <div>
                <Confirm
                    open={isOpen}
                    onCancel={onClose}
                    onConfirm={onConfirm}
                />
            </div>
        )
    }
}

export default ModalConfirm