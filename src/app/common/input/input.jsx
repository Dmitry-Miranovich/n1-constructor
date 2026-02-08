import { useState, useRef, useEffect } from "react";

export default function Input({
  value,
  onChange,
  readOnly = false,
  className = "",
  placeholder = "",
}) {
  const [internalValue, setInternalValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e) => {
    setInternalValue(e.target.value);
  };

  const handleBlur = () => {
    if (internalValue !== value && onChange) {
      onChange(internalValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      inputRef.current?.blur();
    } else if (e.key === "Escape") {
      setInternalValue(value);
      inputRef.current?.blur();
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={internalValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      readOnly={readOnly}
      className={`table-input ${readOnly ? "readonly" : "editable"} ${className}`}
      placeholder={placeholder}
    />
  );
}
