import { useState } from "react";
import Logo from "./Logo";
import Form from "./Form";
import PackingList from "./PackingList";
import Stats from "./Stats";
import Popup from "./Popup";

import { useSelector, useDispatch } from "react-redux";
import { updateItemsArray, addItem, deleteItem, clearItems } from "./itemSlice";

export default function App() {
  // const [items, setItems] = useState([]);

  const { items } = useSelector((state) => state.item);
  const dispatch = useDispatch();

  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [currentUpdatedArray, setCurrentUpdatedArray] = useState([]);
  const [currentItem, setCurrentItem] = useState("");

  const toLowerCase = (x) => x?.toLowerCase().trim();

  function handlePopup(popupResult) {
    const existsSameLowercase = items.find(
      (item) =>
        toLowerCase(item.description) === toLowerCase(currentItem.description)
    );

    /////////////////////////
    // For condition when user enters yes for Do u mean item??
    if (popupResult && popupMessage.startsWith("Do u mean")) {
      if (existsSameLowercase.packed === currentItem.packed) {
        const updatedItems = items.map((item) =>
          item.description === existsSameLowercase.description &&
          item.packed === existsSameLowercase.packed
            ? {
                ...item,
                quantity: item.quantity + currentItem.quantity,
              }
            : item
        );
        dispatch(updateItemsArray(updatedItems));
        setShowPopup(false);
        setCurrentItem("");
      } else {
        setShowPopup(true);
        setPopupMessage(
          `This item is already ${
            existsSameLowercase.packed ? "packed" : "unpacked"
          } Do u want ${existsSameLowercase.description} packed?`
        );
      }
    }

    /////////////////////////
    // For condition when user enters yes for Do u want packed same item??
    else if (
      popupResult &&
      (popupMessage.endsWith("packed?") ||
        popupMessage.startsWith("This item is already packed."))
    ) {
      const condition = (item) =>
        toLowerCase(item.description) ===
          toLowerCase(currentItem.description) && item.packed === true;

      const sameDescPackedTrue = items.find(condition);

      if (sameDescPackedTrue) {
        const updatedItems = items.map((item) =>
          condition(item)
            ? {
                ...item,
                description: existsSameLowercase.description,
                quantity: item.quantity + currentItem.quantity,
              }
            : item
        );
        dispatch(updateItemsArray(updatedItems));
        setShowPopup(false);
        setCurrentItem("");
      } else {
        currentItem.packed = true;
        currentItem.description = existsSameLowercase.description;
        dispatch(addItem(currentItem));
        setShowPopup(false);
        setCurrentItem("");
      }
    } else if (
      !popupResult &&
      popupMessage.startsWith("This item is already packed.")
    ) {
      dispatch(addItem(currentItem));
      setShowPopup(false);
      setCurrentItem("");
    }

    /////////////////////////
    // For condition when user enters no for Do u want packed same item??
    else if (!popupResult && popupMessage.endsWith("packed?")) {
      const condition = (item) =>
        toLowerCase(item.description) ===
          toLowerCase(currentItem.description) && item.packed === false;

      const sameDescPackedFalse = items.find(condition);
      if (sameDescPackedFalse) {
        const updatedItems = items.map((item) =>
          condition(item)
            ? {
                ...item,
                description: existsSameLowercase.description,
                quantity: item.quantity + currentItem.quantity,
              }
            : item
        );

        dispatch(updateItemsArray(updatedItems));
        setShowPopup(false);
        setCurrentItem("");
      } else {
        currentItem.packed = false;
        currentItem.description = existsSameLowercase.description;
        dispatch(addItem(currentItem));
        setShowPopup(false);
        setCurrentItem("");
      }
    }

    /////////////////////////
    // For condition when user enters yes for Do u want to merge same item??
    else if (popupResult && popupMessage.startsWith("Do u want to merge")) {
      const otherItemSmLowerDesc = currentUpdatedArray.find(
        (item) =>
          toLowerCase(item.description) ===
            toLowerCase(currentItem.description) && item.id !== currentItem.id
      );

      const update = currentUpdatedArray
        .map((item) =>
          item.id === currentItem.id
            ? {
                ...item,
                description: otherItemSmLowerDesc.description,
                quantity: item.quantity + otherItemSmLowerDesc.quantity,
              }
            : item
        )
        .filter((item) => item.id !== otherItemSmLowerDesc.id);

      dispatch(updateItemsArray(update));
      setShowPopup(false);
      setCurrentUpdatedArray([]);
      setCurrentItem("");
    }

    /////////////////////////
    // For condition when user enters no for Do u want to merge same item??
    else if (!popupResult && popupMessage.startsWith("Do u want to merge")) {
      // updateItemArray(currentUpdatedArray);
      dispatch(updateItemsArray(currentUpdatedArray));
      setShowPopup(false);
      setCurrentUpdatedArray([]);
      setCurrentItem("");
    }

    /////////////////////////
    // For condition when user enters yes for Do u want to delete item??
    else if (popupResult && popupMessage.startsWith("Do u want to delete")) {
      // updateItemArray(currentUpdatedArray);
      dispatch(deleteItem(currentItem.id));
      setShowPopup(false);
      setCurrentItem("");
    }

    /////////////////////////
    // For condition when user enters no for Do u want to delete item??
    else if (!popupResult && popupMessage.startsWith("Do u want to delete")) {
      setShowPopup(false);
      setCurrentItem("");
      setCurrentItem("");
    }

    /////////////////////////
    // For condition when user enters yes for Do u want clear all items??
    else if (popupResult && popupMessage.endsWith("the items?")) {
      setShowPopup(false);
      dispatch(clearItems());
    }

    /////////////////////////
    // For condition when user enters no for Do u want clear all items??
    else if (!popupResult && popupMessage.endsWith("the items?")) {
      setShowPopup(false);
    }

    /////////////////////////
    // For condition when user enters no for Do u mean item??
    else {
      setShowPopup(false);
      dispatch(addItem(currentItem));
      setCurrentItem("");
    }
  }

  function handleAddItems(newItem) {
    // For finding if there exists any item with exact same description
    const existSmDesc = items.find(
      (item) => item.description === newItem.description
    );

    // For finding if there exists same item as new item after coverting it in lowercase
    const existSmLowerDesc = items.find(
      (item) =>
        toLowerCase(item.description) === toLowerCase(newItem.description)
    );

    if (existSmDesc) {
      const samePacked = items.find(
        (item) =>
          item.description === newItem.description &&
          item.packed === newItem.packed
      );

      if (samePacked) {
        const update = items.map((item) =>
          item.description === newItem.description &&
          item.packed === newItem.packed
            ? {
                ...item,
                quantity: item.quantity + newItem.quantity,
              }
            : item
        );
        dispatch(updateItemsArray(update));
      } else {
        setShowPopup(true);
        setPopupMessage(
          `This item is already packed. Do u want ${existSmDesc.description} packed??`
        );
        setCurrentItem(newItem);
      }
    } else if (existSmLowerDesc) {
      setShowPopup(true);
      setPopupMessage(`Do u mean ${existSmLowerDesc.description}??`);
      setCurrentItem(newItem);
    } else {
      dispatch(addItem(newItem));
      setCurrentItem("");
    }
  }

  function handleItemsQty(id, type) {
    const updatedItem = items.find((item) => item.id === id);
    if (type === "inc") {
      const update = items.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      dispatch(updateItemsArray(update));
    } else {
      if (updatedItem.quantity !== 1) {
        const update = items.map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        );
        dispatch(updateItemsArray(update));
      } else {
        handleDeleteItem(id);
      }
    }
  }

  function handleDeleteItem(id) {
    const deleteditem = items.find((item) => item.id === id);

    setShowPopup(true);
    setPopupMessage(`Do u want to delete ${deleteditem.description}?`);
    setCurrentItem(deleteditem);
  }

  function handleToggleItem(id) {
    // else same logic
    const updatedItems = items.map((item) => {
      return item.id === id ? { ...item, packed: !item.packed } : item;
    });

    const toggleItem = updatedItems.find((item) => item.id === id);
    if (toggleItem.packed === true) document.querySelector(".btn");

    // For finding if there exists exact same item as toggle item (case-sensitive)
    const otherItemSmDesc = updatedItems.find(
      (item) => item.description === toggleItem.description && item.id !== id
    );

    // For finding if there exists same item as toggle item after coverting it in lowercase
    const otherItemSmLowerDesc = updatedItems.find(
      (item) =>
        toLowerCase(item.description) === toLowerCase(toggleItem.description) &&
        item.id !== id
    );

    if (otherItemSmDesc && otherItemSmDesc.packed === toggleItem.packed) {
      const update = updatedItems
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + otherItemSmDesc.quantity }
            : item
        )
        .filter((item) => item.id !== otherItemSmDesc.id);

      dispatch(updateItemsArray(update));
    } else if (
      otherItemSmLowerDesc &&
      otherItemSmLowerDesc.packed === toggleItem.packed
    ) {
      setShowPopup(true);
      setPopupMessage(
        `Do u want to merge ${otherItemSmLowerDesc.description} and ${toggleItem.description}?`
      );
      setCurrentItem(toggleItem);
      setCurrentUpdatedArray(updatedItems);
    } else {
      dispatch(updateItemsArray(updatedItems));
    }
  }

  function handleClearItems() {
    setShowPopup(true);
    setPopupMessage("Are you sure you want delete all the items?");
  }
  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleAddItems} />
      <PackingList
        onUpdateQty={handleItemsQty}
        onDeleteItem={handleDeleteItem}
        onToggleItem={handleToggleItem}
        onClearItems={handleClearItems}
      />
      <Stats />
      {showPopup && <Popup message={popupMessage} handlePopup={handlePopup} />}
    </div>
  );
}
