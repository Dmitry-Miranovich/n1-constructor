import { useState, useMemo } from "react";
import "./select.scss";
import { IMAGE_LIBRARY } from "./select.data";

export default function Select({
  value,
  onChange,
  readOnly,
  options = [], // ← теперь options принимаем как пропс
  className = "",
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [options, searchTerm]);

  const handleSelect = (val) => {
    onChange(val.value); // ← возвращаем value, не url
    setSearchTerm("");
    setIsOpen(false);
  };

  // Находим выбранную опцию для отображения
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={`select-container ${className}`}>
      <div className="select-wrapper">
        {readOnly ? (
          <p>{selectedOption?.label || value}</p>
        ) : (
          <>
            <input
              type="text"
              className="select-input"
              placeholder={selectedOption?.value || "Search or select..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsOpen(true)}
              onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            />

            {isOpen && (
              <ul className="select-dropdown">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((opt, index) => (
                    <li
                      key={opt.value || index}
                      className={`select-item ${value === opt.value ? "active" : ""}`}
                      onClick={() => handleSelect(opt)}
                    >
                      {opt.label}
                      {opt.icon && (
                        <img src={opt.icon} alt="" className="select-icon" />
                      )}
                    </li>
                  ))
                ) : (
                  <li className="select-no-results">No results found</li>
                )}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
