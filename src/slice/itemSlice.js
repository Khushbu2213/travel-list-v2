import { createSlice } from "@reduxjs/toolkit";
import setLocalStorage from "../components/helper";

const storedItems = localStorage.getItem("items");

const initialState = {
  items: storedItems ? JSON.parse(storedItems) : [],
  showPopup: false,
  currentItem: null,
  editDesc: "",
};

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    setShowPopup: (state, action) => {
      state.showPopup = action.payload;
    },
    setCurrentItem: (state, action) => {
      state.currentItem = action.payload;
    },
    addItem: (state, action) => {
      state.items.push(action.payload);
      state.showPopup = false;
      state.currentItem = null;
      setLocalStorage(state.items);
    },
    updateDesc: (state, action) => {
      state.editDesc = action.payload;
    },
    updateItemsArray: (state, action) => {
      state.items = action.payload;
      state.showPopup = false;
      state.currentItem = null;
      setLocalStorage(state.items);
    },
    deleteItem: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
      state.showPopup = false;
      state.currentItem = null;
      setLocalStorage(state.items);
    },
    clearItems: (state) => {
      state.items = [];
      state.showPopup = false;
      setLocalStorage(state.items);
    },
  },
});

export const {
  updateItemsArray,
  updateDesc,
  addItem,
  deleteItem,
  clearItems,
  setShowPopup,
  setCurrentItem,
} = itemSlice.actions;

export default itemSlice.reducer;
