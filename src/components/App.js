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
  // updateDesc,
  setCurrentItem,
  setShowPopup,
  updateCurrentItemDesc,
  updateCurrentItemPacked,
} from "../slice/itemSlice";

import {
  alreadyPackedYesNo,
  deleteAllItems,
  formMessage,
} from "../utils/helper";

export default function App() {
  const { showPopup, currentItem, items } = useSelector((state) => state.item);
  const dispatch = useDispatch();

  const [popupMessage, setPopupMessage] = useState("");
  const [currentUpdatedArray, setCurrentUpdatedArray] = useState([]);
  const [editDescription, setEditDescription] = useState("");

  const toLowerCase = (x) => x?.toLowerCase().trim();
  const checkSameId = (item, id) => item?.id === id;

  function handlePopup(popupResult) {
    const existsSameLowercase = items.find(
      (item) =>
        toLowerCase(item?.description) === toLowerCase(currentItem?.description)
    );

    // Socks socKS
    /////////////////////////
    // For condition when user enters yes for Do u mean item??
    if (popupResult && popupMessage.startsWith("Do u mean")) {
      if (existsSameLowercase.packed === currentItem.packed) {
        const updatedItems = items.map((item) =>
          item.description !== existsSameLowercase.description &&
          item.packed !== existsSameLowercase.packed
            ? item
            : {
                ...item,
                quantity: item.quantity + currentItem.quantity,
              }
        );
        return dispatch(updateItemsArray(updatedItems));
      }
      setShowPopup(true);
      setPopupMessage(
        `This item is already ${
          existsSameLowercase.packed ? "packed" : "unpacked"
        } Do u want ${existsSameLowercase.description} packed?`
      );
      return;
    }

    // For condition when  for Do u want packed same item??
    if (
      popupMessage.endsWith("packed?") ||
      popupMessage.startsWith("This item is already packed.")
    ) {
      ///user enters yes
      if (popupResult) {
        const sameLowerDesc = (item) =>
          toLowerCase(item.description) ===
            toLowerCase(
              editDescription ? editDescription : currentItem.description
            ) && item.packed === true;

        const sameLowerDescPackedTrue = items.find(sameLowerDesc);

        if (sameLowerDescPackedTrue) {
          const updatedItems = items
            .map((item) =>
              sameLowerDesc(item)
                ? {
                    ...item,
                    description: editDescription
                      ? editDescription
                      : existsSameLowercase.description,
                    isEdited: editDescription ? true : false,
                    quantity: item.quantity + currentItem.quantity,
                  }
                : item
            )
            .filter((item) => item.id !== currentItem.id);

          dispatch(updateItemsArray(updatedItems));
          return setEditDescription("");
        }
        dispatch(updateCurrentItemPacked(true));
        dispatch(updateCurrentItemDesc(existsSameLowercase.description));
        dispatch(addItem(currentItem));
        return setEditDescription("");
      }

      // if (!popupResult) {
      const checkLowerDescPackedTrue = (item) =>
        toLowerCase(item.description) ===
          toLowerCase(currentItem.description) && item.packed === false;

      const sameDescPackedFalse = items.find(checkLowerDescPackedTrue);
      if (sameDescPackedFalse) {
        const updatedItems = items.map((item) =>
          checkLowerDescPackedTrue(item)
            ? {
                ...item,
                description: existsSameLowercase.description,
                quantity: item.quantity + currentItem.quantity,
              }
            : item
        );

        dispatch(updateItemsArray(updatedItems));
        return;
      }
      dispatch(updateCurrentItemPacked(false));
      dispatch(updateCurrentItemDesc(existsSameLowercase.description));
      return dispatch(addItem(currentItem));
    }

    // For condition for Do u want to merge same item??
    if (popupMessage.startsWith("Do u want to merge")) {
      //  when user enters yes
      if (popupResult) {
        const otherItemSmLowerDesc = currentUpdatedArray.find(
          (item) =>
            toLowerCase(item.description) ===
              toLowerCase(
                editDescription ? editDescription : currentItem.description
              ) && item.id !== currentItem.id
        );

        const update = currentUpdatedArray
          .map((item) =>
            checkSameId(item, currentItem.id)
              ? {
                  ...item,
                  description: otherItemSmLowerDesc.description,
                  quantity: item.quantity + otherItemSmLowerDesc.quantity,
                  isEdited: editDescription ? true : false,
                }
              : item
          )
          .filter((item) => item.id !== otherItemSmLowerDesc.id);

        dispatch(updateItemsArray(update));
        setCurrentUpdatedArray([]);
        return setEditDescription("");
      }
      //  when user enters no
      dispatch(updateItemsArray(currentUpdatedArray));
      return setCurrentUpdatedArray([]);
    }

    // For condition for Do u want to delete item??
    if (popupMessage.startsWith("Do u want to delete")) {
      if (popupResult) return dispatch(deleteItem(currentItem.id));
      dispatch(setShowPopup(false));
      return dispatch(setCurrentItem(""));
    }

    // For condition when user enters yes for Do u want clear all items??
    if (popupMessage.endsWith("the items?")) {
      if (popupResult) return dispatch(clearItems());
      return dispatch(setShowPopup(false));
    }

    /////////////////////////
    // For condition when user enters save for after editing the item?
    if (popupResult && popupMessage.includes("Edit")) {
      const updatedArray = items.map((item) =>
        checkSameId(item, currentItem.id)
          ? { ...item, description: editDescription, isEdited: true }
          : item
      );

      // For finding if there is any item having exact same description as of editedItem
      const otherItemSmDesc = updatedArray.find(
        (item) =>
          item.description === editDescription && item.id !== currentItem.id
      );

      // For finding if there is any item having same lowercase conversion description as of editedItem
      const otherItemSmLowerDesc = updatedArray.find(
        (item) =>
          toLowerCase(item.description) === toLowerCase(editDescription) &&
          item.id !== currentItem.id
      );

      // if editedItem have packed status == another exact same description packed status than directly merge
      if (otherItemSmDesc && otherItemSmDesc.packed === currentItem.packed) {
        const update = updatedArray
          .map((item) =>
            checkSameId(item, currentItem.id)
              ? {
                  ...item,
                  description: editDescription,
                  quantity: item.quantity + otherItemSmDesc.quantity,
                  isEdited: true,
                }
              : item
          )
          .filter((item) => item.id !== otherItemSmDesc.id);

        // console.log(update);
        dispatch(updateItemsArray(update));
        return setEditDescription("");
      }

      // if editedItem.packed status == another same lowercase conversion description packed status than popup of merge
      if (
        otherItemSmLowerDesc &&
        otherItemSmLowerDesc.packed === currentItem.packed
      ) {
        dispatch(setCurrentItem(currentItem));
        dispatch(setShowPopup(true));
        setPopupMessage(
          `Do u want to merge ${otherItemSmLowerDesc.description} and ${editDescription}?`
        );
        setCurrentUpdatedArray(updatedArray);
        return;
      }

      // if editedItem.packed status != another item of exactSameDescription or conversion lowercase description packed status than popup packed for merge in packed or not
      if (
        (otherItemSmDesc && otherItemSmDesc.packed !== currentItem.packed) ||
        (otherItemSmLowerDesc &&
          otherItemSmLowerDesc.packed !== currentItem.packed)
      ) {
        dispatch(setShowPopup(true));
        setPopupMessage(alreadyPackedYesNo);
        dispatch(setCurrentItem(currentItem));
        return;
      }

      // Direct updation of item edited description
      dispatch(updateItemsArray(updatedArray));
      return setEditDescription("");
    }

    ///// For condition when user enters cancel for after editing the item?
    if (!popupResult && popupMessage.includes("Edit")) {
      const update = items.map((item) =>
        checkSameId(item, currentItem.id) ? { ...item, isEdited: false } : item
      );
      dispatch(updateItemsArray(update));
      return setEditDescription("");
    }

    // For condition when user enters no for Do u mean item??
    return dispatch(addItem(currentItem));
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
        return dispatch(updateItemsArray(update));
      }

      dispatch(setShowPopup(true));
      setPopupMessage(
        `This item is already packed. Do u want ${existSmDesc.description} packed??`
      );
      dispatch(setCurrentItem(newItem));
      return;
    }
    if (existSmLowerDesc) {
      dispatch(setShowPopup(true));
      setPopupMessage(`Do u mean ${existSmLowerDesc.description}??`);
      dispatch(setCurrentItem(newItem));
      return;
    }
    return dispatch(addItem(newItem));
  }

  function handleItemsQty(id, type) {
    const updatedItem = items.find((item) => checkSameId(item, id));
    if (type === "inc") {
      const update = items.map((item) =>
        checkSameId(item, id) ? { ...item, quantity: item.quantity + 1 } : item
      );
      return dispatch(updateItemsArray(update));
    }
    if (updatedItem.quantity !== 1) {
      const update = items.map((item) =>
        checkSameId(item, id)
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      );
      return dispatch(updateItemsArray(update));
    }
    return handleDeleteItem(id);
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

      return dispatch(updateItemsArray(update));
    }

    if (
      otherItemSmLowerDesc &&
      otherItemSmLowerDesc.packed === toggleItem.packed
    ) {
      dispatch(setShowPopup(true));
      setPopupMessage(
        `Do u want to merge ${otherItemSmLowerDesc.description} and ${toggleItem.description}?`
      );
      dispatch(setCurrentItem(toggleItem));
      return setCurrentUpdatedArray(updatedItems);
    }
    return dispatch(updateItemsArray(updatedItems));
  }

  function handleClearItems() {
    dispatch(setShowPopup(true));
    setPopupMessage(deleteAllItems);
  }

  function handleEditItem(editItem) {
    const item = items.find((item) => checkSameId(item, editItem.id));
    dispatch(setShowPopup(true));
    dispatch(setCurrentItem(item));
    setPopupMessage(formMessage);
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
      {showPopup && (
        <Popup
          message={popupMessage}
          handlePopup={handlePopup}
          editDescription={editDescription}
          setEditDescription={setEditDescription}
        />
      )}
    </div>
  );
}
