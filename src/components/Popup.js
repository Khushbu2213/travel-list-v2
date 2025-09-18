import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import "./../Popup.css";
// import { useState } from "react";

function Popup({ message, handlePopup, editDescription, setEditDescription }) {
  const currentItem = useSelector((state) => state.item.currentItem);
  const inputRef = useRef();
  const editFormMsg = message.includes("Edit");

  useEffect(() => {
    if (editFormMsg && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editFormMsg]);

  const disabledButton = editDescription === currentItem?.description;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <p className="popup-message">{message}</p>
        {editFormMsg && (
          <form>
            <input
              ref={inputRef}
              className="popup-input"
              type="text"
              placeholder="item"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
          </form>
        )}
        <div className="popup-buttons">
          <button
            className="btn-popup btn-no"
            onClick={() => handlePopup(false)}
          >
            {editFormMsg ? "Cancel" : "No"}
          </button>
          <button
            className={
              editFormMsg && disabledButton
                ? `btn-popup btn-disabled`
                : `btn-popup btn-yes`
            }
            onClick={() => handlePopup(true)}
            disabled={editFormMsg ? disabledButton : false}
          >
            {editFormMsg ? "Save" : "Yes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
