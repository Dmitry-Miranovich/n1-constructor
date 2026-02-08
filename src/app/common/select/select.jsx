import { useState, useMemo } from "react";
import "./select.scss";
import { IMAGE_LIBRARY } from "./select.data";

export default function Select({
  value,
  onChange,
  readOnly,
  category = "banners",
  className = "",
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const options = IMAGE_LIBRARY[category] || [];

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [options, searchTerm]);

  const handleSelect = (val) => {
    onChange(val.url);
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <div className={`select-container ${className}`}>
      <div className="select-wrapper">
        {readOnly ? (
          <p>{value}</p>
        ) : (
          <input
            type="text"
            className="select-input"
            placeholder={value || "Search or select..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)} // Delay to allow click
          />
        )}

        {isOpen && (
          <ul className="select-dropdown">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, index) => (
                <li
                  key={index}
                  className={`select-item ${value === opt ? "active" : ""}`}
                  onClick={() => handleSelect(opt)}
                >
                  {opt.label}
                </li>
              ))
            ) : (
              <li className="select-no-results">No results found</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
