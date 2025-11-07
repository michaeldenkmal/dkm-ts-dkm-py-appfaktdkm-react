import React from "react";
import "./NativeDialog.css";

interface ModalProps {
    isOpen:boolean
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export default function NativeDialog(props: ModalProps) {
    const { onClose, title, children, footer } = props

    function renderHeader(){
        if (title) {
            return (
            <div className="modal-header">
                <h2 className="text-lg font-semibold">{title}</h2>
                <button onClick={onClose} className="text-white hover:text-red-400 text-xl font-bold">&times;</button>
            </div>
            )
        }
    }

    function renderFooter() {
        if (footer) {
            return (<div className="modal-footer">
                    {footer}
                </div>
            )
        }
    }
    if (!props.isOpen) {
        return null
    }
    return (
        <div className="modal-wrapper">
            <div className="modal-root">
                    {renderHeader()}
                    {/* Body */}
                    <div className="modal-body">
                        {children}
                    </div>
                    {/* Footer */}
                    {renderFooter()}
            </div>
        </div>
    );
}
