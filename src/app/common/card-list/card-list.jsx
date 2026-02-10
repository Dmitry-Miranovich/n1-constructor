import { useState, useEffect } from "react";
import Card from "../card/card";
import "./card-list.scss";

/**
 * @typedef {Object} CardItem
 * @property {string} image - URL изображения
 * @property {string} name - Название элемента
 * @property {string} status - Название элемента
 */

/**
 * Компонент списка карточек
 * @param {Object} props - Свойства компонента
 * @param {string} props.icon - Иконка компонента (URL или название класса)
 * @param {string} props.name - Название списка
 * @param {CardItem[]} props.items - Массив элементов карточек
 * @param {number} [props.itemsPerView=5] - Количество карточек на экране
 */
export default function CardList({ icon, name, items, itemsPerView = 5 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState([]);

  // Calculate max index
  const maxIndex = Math.max(0, items.length - itemsPerView);

  // Update visible items when currentIndex or items change
  useEffect(() => {
    const start = currentIndex;
    const end = currentIndex + itemsPerView;
    setVisibleItems(items.slice(start, end));
  }, [currentIndex, items, itemsPerView]);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // Disable buttons when at limits
  const isPrevDisabled = currentIndex === 0;
  const isNextDisabled = currentIndex >= maxIndex;

  return (
    <section className="card-list">
      <div className="card-list-header">
        <div className="card-list-header-title">
          <img src={icon} alt="Card List Icon" />
          <p>{name}</p>
        </div>
        <div className="card-list-header-navigations">
          <button
            className="card-list-header-navigations-button"
            onClick={handlePrev}
            disabled={isPrevDisabled}
            aria-label="Previous cards"
          >
            {`<`}
          </button>
          <button
            className="card-list-header-navigations-button"
            onClick={handleNext}
            disabled={isNextDisabled}
            aria-label="Next cards"
          >
            {`>`}
          </button>
        </div>
      </div>
      <div className="card-list-body">
        {visibleItems.map((item, index) => (
          <Card
            name={item.name}
            image={item.image}
            index={currentIndex + index}
            status={item.status}
            key={`card-${currentIndex + index}`}
          />
        ))}
      </div>

      {/* Optional: Show current position */}
      {items.length > itemsPerView && (
        <div className="card-list-footer">
          <span className="card-list-footer-counter">
            {currentIndex + 1} -{" "}
            {Math.min(currentIndex + itemsPerView, items.length)} of{" "}
            {items.length}
          </span>
        </div>
      )}
    </section>
  );
}
