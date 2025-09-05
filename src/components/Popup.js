import "./../Popup.css";

function Popup({ message, handlePopup }) {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <p className="popup-message">{message}</p>
        <div className="popup-buttons">
          <button
            className="btn-popup btn-no"
            onClick={() => handlePopup(false)}
          >
            No
          </button>
          <button
            className="btn-popup btn-yes"
            onClick={() => handlePopup(true)}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
