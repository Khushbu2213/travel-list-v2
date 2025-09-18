export default function Item({
  item,
  onUpdateQty,
  onDeleteItem,
  onToggleItem,
  onEditItem,
}) {
  return (
    <li>
      {!item.packed && (
        <button className="btn" onClick={() => onEditItem(item)}>
          ✏️
        </button>
      )}
      <input
        type="checkbox"
        value={item.packed}
        checked={item.packed}
        onChange={() => onToggleItem(item.id)}
      ></input>
      <div className="item-description">
        {item.isEdited && <p className="edit-item">edited</p>}
        <span style={item.packed ? { textDecoration: "line-through" } : {}}>
          {item.quantity} {item.description}
        </span>
      </div>

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
