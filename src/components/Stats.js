import { useSelector } from "react-redux";

export default function Stats() {
  const { items } = useSelector((state) => state.item);
  if (!items.length)
    return (
      <p className="stats">
        <em>Start adding some items to your packing list 🚀.</em>
      </p>
    );

  const numItems = items.reduce((total, item) => total + item.quantity, 0);
  const packedItems = items.reduce((total, item) => {
    if (item.packed) return total + item.quantity;
    return total;
  }, 0);

  const packedPer = Math.round((packedItems / numItems) * 100);

  return (
    <footer className="stats">
      <em>
        {packedPer === 100
          ? `You packed everything! Ready to go ✈`
          : `💼You
        have ${numItems} items in your list, and you already packed ${packedItems}(
        ${packedPer}
        %)`}
      </em>
    </footer>
  );
}
