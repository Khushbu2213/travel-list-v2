import { useState } from "react";
// import { useSelector } from "react-redux";
// import Popup from "./Popup";

export default function Form({ onAddItems }) {
  // const { items } = useSelector((state) => state.item.items);
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();

    if (!description) return;
    // console.log(description);
    // setShowPopup(true);
    // console.log(description);
    const newItem = {
      description,
      quantity,
      isEdited: false,
      packed: false,
      id: `${Date.now()}-${Math.random()}`,
    };

    // popupCheck(newItem);
    onAddItems(newItem);

    setDescription("");
    setQuantity(1);
  }

  return (
    <>
      <form className="add-form" onSubmit={handleSubmit}>
        <h3>What do you need for your 😍 trip?</h3>
        <select
          value={quantity}
          onChange={(e) => {
            setQuantity(Number(e.target.value));
          }}
        >
          {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
            <option value={num} key={num}>
              {num}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Item..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></input>

        <button>Add</button>
      </form>
    </>
  );
}
