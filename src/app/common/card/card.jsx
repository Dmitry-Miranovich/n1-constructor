import CardTag from "./_components/card-tag";
import "./card.scss";

/**
 * Карточка для списка
 * @param {Object} props - Свойства компонента
 * @param {string} props.image - Изображение компонента
 * @param {string} props.name - Название карточки
 * @param {number} props.index - Индекс карточки
 * @param {string} props.status - Индекс карточки
 */
export default function Card({ image, name, index, status }) {
  return (
    <article className="card" aria-label={`Card-${name}`}>
      <CardTag status={status} />
      <img
        className="card-image"
        src={`${process.env.REACT_APP_API_URL}${image}`}
        alt={`Card Item ${index}`}
      />
    </article>
  );
}
