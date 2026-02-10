import "./card-tag.scss";

/**
 * Тэг Карточки
 * @param {Object} this.props
 * @param {string} this.props.status
 * @returns
 */

export default function CardTag({ status }) {
  return (
    <div className={`card-tag ${status}`}>
      {status === "top"
        ? "Top"
        : status === "exclusive"
          ? "Exclusive"
          : status === "limited"
            ? "Limited"
            : status === "new"
              ? "New"
              : "Standard"}
    </div>
  );
}
