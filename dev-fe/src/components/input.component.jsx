const InputBox = ({ name, type, id, value, placeholder, icon, disabled }) => {
  return (
    <div className="relative w-[100%] mb-4">
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={value}
        id={id}
        className="input-box"
        disabled={disabled}
      />

      <span className={"fi " + icon + " input-icon icon"}></span>
    </div>
  )
}

export default InputBox;