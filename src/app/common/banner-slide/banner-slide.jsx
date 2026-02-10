import "./banner-slide.scss";

/**
 * @typedef {Object} CardItem
 * @property {string} image - URL изображения
 * @property {string} name - Название баннера
 * @property {string} provider - Название провайдера
 * @property {string} description - Название описания
 * @property {string} href - Название описания
 */

/**
 * Banner Slide for the carousel
 * @param {Object} props
 * @param {CardItem} props.card
 * @returns
 */
export default function BannerSlide({ card }) {
  const { image, provider, description, name, href } = card;
  return (
    <div className="banner-slide">
      <div className="banner-slide-info">
        <p className="banner-slide-info-provider">{provider}</p>
        <div className="banner-slide-info-title">
          <h3 className="banner-slide-info-title-text">{name}</h3>
          <p className="banner-slide-info-desc"> {description}</p>
        </div>
        <a href={href} className="banner-slide-info-link">
          Check now!
        </a>
      </div>
      <img
        src={`${process.env.REACT_APP_API_URL}${image}`}
        alt="Banner Slide"
      />
    </div>
  );
}
