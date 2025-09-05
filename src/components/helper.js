export default function setLocalStorage(items) {
  if (items.length > 0)
    return localStorage.setItem("items", JSON.stringify(items));
  else return localStorage.removeItem("items");
}
