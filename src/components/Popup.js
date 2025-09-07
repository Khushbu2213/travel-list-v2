import { useDispatch, useSelector } from "react-redux";
import "./../Popup.css";
import { updateDesc } from "../slice/itemSlice";
// import { useState } from "react";

function Popup({ message, handlePopup }) {
  const currentItem = useSelector((state) => state.item.currentItem);
  const editDesc = useSelector((state) => state.item.editDesc);
  const dispatch = useDispatch();

  const editFormMsg = message.includes("Edit");

  const disabledButton = editDesc === currentItem?.description;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <p className="popup-message">{message}</p>
        {editFormMsg && (
          <form>
            <input
              className="popup-input"
              type="text"
              placeholder="item"
              defaultValue={currentItem.description}
              value={editDesc}
              onChange={(e) => dispatch(updateDesc(e.target.value))}
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
