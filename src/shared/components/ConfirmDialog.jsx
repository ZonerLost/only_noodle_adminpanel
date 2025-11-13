import React from "react";
import Modal from "./Modal.jsx";
export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message,
  onCancel,
  onConfirm,
  confirmText = "Confirm",
}) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      footer={
        <div className="flex items-center gap-2 justify-end">
          <button className="btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      }
    >
      <div className="muted">{message}</div>
    </Modal>
  );
}
