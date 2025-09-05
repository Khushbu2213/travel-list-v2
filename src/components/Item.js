export default function Item({
  item,
  onUpdateQty,
  onDeleteItem,
  onToggleItem,
}) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        checked={item.packed}
        onChange={() => onToggleItem(item.id)}
      ></input>
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>

      {!item.packed && (
        <>
          <button className="btn" onClick={() => onUpdateQty(item.id, "dec")}>
            ➖
          </button>
          <button className="btn" onClick={() => onUpdateQty(item.id, "inc")}>
            ➕
          </button>
        </>
      )}
      <button className="btn" onClick={() => onDeleteItem(item.id)}>
        ❌
      </button>
    </li>
  );
}
