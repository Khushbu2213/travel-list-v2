export const alreadyPackedYesNo = `This item is already packed. Do u want packed or not?`;
export const deleteAllItems = "Are you sure you want to delete all the items?";
export const formMessage = "Edit Form";

export default function setLocalStorage(items) {
  if (items.length > 0)
    return localStorage.setItem("items", JSON.stringify(items));
  else return localStorage.removeItem("items");
}
