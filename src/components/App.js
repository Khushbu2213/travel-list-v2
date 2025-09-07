import { useState } from "react";
import Logo from "./Logo";
import Form from "./Form";
import PackingList from "./PackingList";
import Stats from "./Stats";
import Popup from "./Popup";

import { useSelector, useDispatch } from "react-redux";
import {
  updateItemsArray,
  addItem,
  deleteItem,
  clearItems,
  updateDesc,
  setCurrentItem,
  setShowPopup,
} from "../slice/itemSlice";

export default function App() {
  const showPopup = useSelector((state) => state.item.showPopup);
  const currentItem = useSelector((state) => state.item.currentItem);

  const items = useSelector((state) => state.item.items);
  const editDesc = useSelector((state) => state.item.editDesc);
  const dispatch = useDispatch();

  const [popupMessage, setPopupMessage] = useState("");
  const [currentUpdatedArray, setCurrentUpdatedArray] = useState([]);

  const toLowerCase = (x) => x?.toLowerCase().trim();
  const checkSameId = (item, id) => item.id === id;
  // const checkExactSameDesc

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
      } else {
        currentItem.packed = true;
        currentItem.description = existsSameLowercase.description;
        dispatch(addItem(currentItem));
      }
    } else if (
      !popupResult &&
      popupMessage.startsWith("This item is already packed.")
    ) {
      dispatch(addItem(currentItem));
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
      } else {
        currentItem.packed = false;
        currentItem.description = existsSameLowercase.description;
        dispatch(addItem(currentItem));
      }
    }

    /////////////////////////
    // For condition when user enters yes for Do u want to merge same item??
    else if (popupResult && popupMessage.startsWith("Do u want to merge")) {
      const otherItemSmLowerDesc = currentUpdatedArray.find((item) => {
        if (!editDesc) {
          return (
            toLowerCase(item.description) ===
              toLowerCase(currentItem.description) && item.id !== currentItem.id
          );
        } else {
          return (
            toLowerCase(item.description) === toLowerCase(editDesc) &&
            item.id !== currentItem.id
          );
        }
      });
      // console.log(otherItemSmLowerDesc);

      const update = currentUpdatedArray
        .map((item) =>
          checkSameId(item, currentItem.id)
            ? {
                ...item,
                description: otherItemSmLowerDesc.description,
                quantity: item.quantity + otherItemSmLowerDesc.quantity,
                isEdited: editDesc ? true : false,
              }
            : item
        )
        .filter((item) => item.id !== otherItemSmLowerDesc.id);

      // console.log(update);
      dispatch(updateItemsArray(update));
      setCurrentUpdatedArray([]);
      dispatch(updateDesc(""));
    }

    /////////////////////////
    // For condition when user enters no for Do u want to merge same item??
    else if (!popupResult && popupMessage.startsWith("Do u want to merge")) {
      console.log(currentUpdatedArray);
      dispatch(updateItemsArray(currentUpdatedArray));
      setCurrentUpdatedArray([]);
    }

    /////////////////////////
    // For condition when user enters yes for Do u want to delete item??
    else if (popupResult && popupMessage.startsWith("Do u want to delete")) {
      dispatch(deleteItem(currentItem.id));
    }

    /////////////////////////
    // For condition when user enters no for Do u want to delete item??
    else if (!popupResult && popupMessage.startsWith("Do u want to delete")) {
      dispatch(setShowPopup(false));
      dispatch(setCurrentItem(""));
    }

    /////////////////////////
    // For condition when user enters yes for Do u want clear all items??
    else if (popupResult && popupMessage.endsWith("the items?")) {
      dispatch(clearItems());
    }

    /////////////////////////
    // For condition when user enters no for Do u want clear all items??
    else if (!popupResult && popupMessage.endsWith("the items?")) {
      dispatch(setShowPopup(false));
    }

    /////////////////////////
    // For condition when user enters save for after editing the item?
    else if (popupResult && popupMessage.includes("Edit")) {
      const updatedArray = items.map((item) =>
        checkSameId(item, currentItem.id)
          ? { ...item, description: editDesc, isEdited: true }
          : item
      );

      const otherItemSmDesc = updatedArray.find(
        (item) => item.description === editDesc && item.id !== currentItem.id
      );
      // console.log(otherItemSmDesc);

      const otherItemSmLowerDesc = updatedArray.find(
        (item) =>
          toLowerCase(item.description) === toLowerCase(editDesc) &&
          item.id !== currentItem.id
      );

      if (otherItemSmDesc && otherItemSmDesc.packed === currentItem.packed) {
        const update = updatedArray
          .map((item) =>
            checkSameId(item, currentItem.id)
              ? {
                  ...item,
                  description: editDesc,
                  quantity: item.quantity + otherItemSmDesc.quantity,
                  isEdited: true,
                }
              : item
          )
          .filter((item) => item.id !== otherItemSmDesc.id);

        // console.log(update);
        dispatch(updateItemsArray(update));
        dispatch(updateDesc(""));
      } else if (
        otherItemSmLowerDesc &&
        otherItemSmLowerDesc.packed === currentItem.packed
      ) {
        dispatch(setCurrentItem(currentItem));
        dispatch(setShowPopup(true));
        setPopupMessage(
          `Do u want to merge ${otherItemSmLowerDesc.description} and ${editDesc}?`
        );
        setCurrentUpdatedArray(updatedArray);
      } else {
        // console.log(updatedArray);
        dispatch(updateItemsArray(updatedArray));
        dispatch(updateDesc(""));
      }
    } else if (!popupResult && popupMessage.includes("Edit")) {
      const update = items.map((item) =>
        checkSameId(item, currentItem.id) ? { ...item, isEdited: false } : item
      );
      // console.log(update);
      dispatch(updateItemsArray(update));
      dispatch(updateDesc(""));
    }

    /////////////////////////
    // For condition when user enters no for Do u mean item??
    else {
      dispatch(addItem(currentItem));
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

    const conditionSmDescSmPacked = (item) =>
      item.description === newItem.description &&
      item.packed === newItem.packed;

    if (existSmDesc) {
      const samePacked = items.find(conditionSmDescSmPacked);

      if (samePacked) {
        const update = items.map((item) =>
          conditionSmDescSmPacked(item)
            ? {
                ...item,
                quantity: item.quantity + newItem.quantity,
              }
            : item
        );
        dispatch(updateItemsArray(update));
      } else {
        dispatch(setShowPopup(true));
        setPopupMessage(
          `This item is already packed. Do u want ${existSmDesc.description} packed??`
        );
        dispatch(setCurrentItem(newItem));
      }
    } else if (existSmLowerDesc) {
      dispatch(setShowPopup(true));
      setPopupMessage(`Do u mean ${existSmLowerDesc.description}??`);
      dispatch(setCurrentItem(newItem));
    } else {
      dispatch(addItem(newItem));
    }
  }

  function handleItemsQty(id, type) {
    const updatedItem = items.find((item) => checkSameId(item, id));
    if (type === "inc") {
      const update = items.map((item) =>
        checkSameId(item, id) ? { ...item, quantity: item.quantity + 1 } : item
      );
      dispatch(updateItemsArray(update));
    } else {
      if (updatedItem.quantity !== 1) {
        const update = items.map((item) =>
          checkSameId(item, id)
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
    const deleteditem = items.find((item) => checkSameId(item, id));
    dispatch(setShowPopup(true));
    setPopupMessage(`Do u want to delete ${deleteditem.description}?`);
    dispatch(setCurrentItem(deleteditem));
  }

  function handleToggleItem(id) {
    const updatedItems = items.map((item) => {
      return checkSameId(item, id) ? { ...item, packed: !item.packed } : item;
    });

    const toggleItem = updatedItems.find((item) => checkSameId(item, id));
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
          checkSameId(item, id)
            ? { ...item, quantity: item.quantity + otherItemSmDesc.quantity }
            : item
        )
        .filter((item) => item.id !== otherItemSmDesc.id);

      dispatch(updateItemsArray(update));
    } else if (
      otherItemSmLowerDesc &&
      otherItemSmLowerDesc.packed === toggleItem.packed
    ) {
      dispatch(setShowPopup(true));
      setPopupMessage(
        `Do u want to merge ${otherItemSmLowerDesc.description} and ${toggleItem.description}?`
      );
      dispatch(setCurrentItem(toggleItem));
      setCurrentUpdatedArray(updatedItems);
    } else {
      dispatch(updateItemsArray(updatedItems));
    }
  }

  function handleClearItems() {
    dispatch(setShowPopup(true));
    setPopupMessage("Are you sure you want to delete all the items?");
  }

  function handleEditItem(id) {
    const editItem = items.find((item) => checkSameId(item, id));
    dispatch(updateDesc(editItem.description));
    // const update = items.map((item) =>
    //   editItem ? { ...item, isEdited: true } : item
    // );
    // dispatch(updateItemsArray(update));
    dispatch(setShowPopup(true));
    dispatch(setCurrentItem(editItem));
    setPopupMessage("Edit Form");
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
        onEditItem={handleEditItem}
      />
      <Stats />
      {showPopup && <Popup message={popupMessage} handlePopup={handlePopup} />}
      {showPopup && !popupMessage.includes("Edit") && (
        <Popup message={popupMessage} handlePopup={handlePopup} />
      )}
    </div>
  );
}
