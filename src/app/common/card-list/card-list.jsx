import React from "react";
import "./card-list.scss";
/**
 * @typedef {Object} CardItem
 * @property {string} image - URL изображения
 * @property {string} name - Название элемента
 */

/**
 * Компонент списка карточек
 * @param {Object} props - Свойства компонента
 * @param {string} props.icon - Иконка компонента (URL или название класса)
 * @param {string} props.name - Название списка
 * @param {CardItem[]} props.items - Массив элементов карточек
 */
export default function CardList({ icon, name, items }) {
  return (
    <section className="card-list">
      <div className="card-list-header">
        <div className="card-list-header-title">
          <img src={icon} alt="Card List Icon" />
          <p>{name}</p>
        </div>
        <div className="card-list-header-navigations">
          <button className="card-list-header-navigations-button">{`<`}</button>
          <button className="card-list-header-navigations-button">{`>`}</button>
        </div>
      </div>
      <div>
        {items.map((item, index) => (
          <div key={index}>
            {
              // card there
            }
          </div>
        ))}
      </div>
    </section>
  );
}
