import React from 'react';
import { Modal } from 'antd';
import { FiAlertTriangle } from 'react-icons/fi';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
    confirmText?: string;
    cancelText?: string;
    danger?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    title,
    message,
    onConfirm,
    onCancel,
    loading = false,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    danger = false,
}) => {
    return (
        <Modal
            open={open}
            title={
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${danger ? 'bg-red-100 dark:bg-red-900/30' : 'bg-primary/10 dark:bg-emerald-900/30'} flex items-center justify-center`}>
                        <FiAlertTriangle className={`text-xl ${danger ? 'text-red-500' : 'text-primary dark:text-emerald-400'}`} />
                    </div>
                    <span className="text-lg font-semibold dark:text-gray-100">{title}</span>
                </div>
            }
            onOk={onConfirm}
            onCancel={onCancel}
            confirmLoading={loading}
            okText={confirmText}
            cancelText={cancelText}
            okButtonProps={{
                danger: danger,
                className: danger ? '' : 'bg-primary hover:bg-primary-600',
            }}
            centered
        >
            <p className="text-gray-600 dark:text-gray-300 mt-4">{message}</p>
        </Modal>
    );
};

export default ConfirmDialog;
