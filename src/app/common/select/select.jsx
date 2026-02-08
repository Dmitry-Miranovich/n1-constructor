// ImageSelect.jsx
import { useState } from "react";
import "./select.scss";
import { IMAGE_LIBRARY } from "./select.data";

/**
 * Компонент выбора изображения из библиотеки
 * @param {Object} props
 * @param {string} props.value - Текущее выбранное изображение (URL)
 * @param {Function} props.onChange - Колбэк при изменении выбора
 * @param {string} props.category - Категория изображений ('banners', 'games', 'icons')
 * @param {string} props.label - Лейбл для поля
 * @param {string} props.className - Дополнительные CSS классы
 */
export default function ImageSelect({
  value,
  onChange,
  category = "banners",
  label = "Select Image",
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Демо-библиотека изображений

  const images = IMAGE_LIBRARY[category] || [];

  // Фильтрация по поиску
  const filteredImages = search
    ? images.filter(
        (img) =>
          img.label.toLowerCase().includes(search.toLowerCase()) ||
          (img.provider &&
            img.provider.toLowerCase().includes(search.toLowerCase())),
      )
    : images;

  const selectedImage = images.find((img) => img.url === value);

  const handleSelect = (imageUrl) => {
    onChange(imageUrl);
    setIsOpen(false);
    setSearch("");
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className={`image-select ${className}`}>
      {label && <label className="image-select-label">{label}</label>}

      <div className="image-select-trigger" onClick={() => setIsOpen(!isOpen)}>
        {selectedImage ? (
          <div className="image-select-selected">
            <img
              src={selectedImage.url}
              alt={selectedImage.label}
              className="image-preview"
            />
            <span className="image-label">{selectedImage.label}</span>
          </div>
        ) : (
          <div className="image-select-placeholder">
            <span>Click to select image...</span>
          </div>
        )}
        <span className="image-select-arrow">{isOpen ? "▲" : "▼"}</span>
      </div>

      {isOpen && (
        <div className="image-select-dropdown">
          <div className="image-select-search">
            <input
              type="text"
              placeholder="Search images..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="image-search-input"
              onClick={(e) => e.stopPropagation()}
            />
            {value && (
              <button
                onClick={handleClear}
                className="clear-button"
                title="Clear selection"
              >
                ✕
              </button>
            )}
          </div>

          <div className="image-select-grid">
            {filteredImages.length > 0 ? (
              filteredImages.map((img) => (
                <div
                  key={img.id}
                  className={`image-select-option ${value === img.url ? "selected" : ""}`}
                  onClick={() => handleSelect(img.url)}
                  title={`${img.label}${img.size ? ` (${img.size})` : ""}${img.provider ? ` - ${img.provider}` : ""}`}
                >
                  <img src={img.url} alt={img.label} className="option-image" />
                  <div className="option-label">{img.label}</div>
                  {img.provider && (
                    <div className="option-meta">{img.provider}</div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-results">No images found</div>
            )}
          </div>

          <div className="image-select-footer">
            <small>
              {images.length} images available • {category} category
            </small>
          </div>
        </div>
      )}
    </div>
  );
}
