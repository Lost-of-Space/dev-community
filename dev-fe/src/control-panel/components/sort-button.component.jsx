const SortButton = ({ sortFunc, sortBy, fieldState, orderState, label }) => {
  return (
    <button className="w-full h-full flex justify-between py-3 px-4 hover:bg-grey/30 active:bg-grey/30 items-center" onClick={() => sortFunc(sortBy)}>
      <span>{label}</span>
      <span className={"-mb-1 inline-block fi fi-" + (fieldState === sortBy ? (orderState === "asc" ? "rr-angle-small-up" : "rr-angle-small-down") : "rr-minus-small")}></span>
    </button>
  );
};


export default SortButton;