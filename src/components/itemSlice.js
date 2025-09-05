import { createSlice } from "@reduxjs/toolkit";
import setLocalStorage from "./helper";

const storedItems = localStorage.getItem("items");

const initialState = {
  items: storedItems ? JSON.parse(storedItems) : [],
};

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload);
      setLocalStorage(state.items);
    },
    updateItemsArray: (state, action) => {
      state.items = action.payload;
      setLocalStorage(state.items);
    },
    deleteItem: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
      setLocalStorage(state.items);
    },
    clearItems: (state) => {
      state.items = [];
      setLocalStorage(state.items);
    },
  },
});

export const { updateItemsArray, addItem, deleteItem, clearItems } =
  itemSlice.actions;

export default itemSlice.reducer;
