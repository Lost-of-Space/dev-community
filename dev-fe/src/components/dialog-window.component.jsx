import { useState } from "react";
import React from "react";


const DialogWrapper = ({
  children,
  onConfirm,
  message = <p>Are you sure you want to do this?</p>,
  confirmText = "Confirm",
  cancelText = "Cancel"
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTriggerClick = (e) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  const triggerWithClick = () => {
    return typeof children === "function"
      ? children({ open: handleTriggerClick })
      : React.cloneElement(children, {
        onClick: handleTriggerClick,
      });
  };

  const handleConfirm = () => {
    onConfirm?.();
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <>
      {triggerWithClick()}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black-404/50 flex items-center justify-center">
          <div
            className="bg-white border-grey shadow-md border-2 p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4">
              {message}
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-grey">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-grey text-black hover:bg-black hover:text-white"
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-royalblue text-white-404 hover:bg-black hover:text-white"
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DialogWrapper;
