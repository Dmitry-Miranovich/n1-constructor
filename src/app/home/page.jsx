import Carousel from "../common/carousel";
import "./page.scss";
import NavList from "../common/nav-list/nav-list";
import { useGet } from "../_utils/hooks/useGet";
import CardList from "../common/card-list/card-list";
import { useEffect, useState } from "react";
import BannerSlide from "../common/banner-slide/banner-slide";

export default function HomePage() {
  const { data: banners } = useGet("banner");
  const { data: blocks } = useGet("blocks");
  const { data: color } = useGet("colorBG");
  const { data: cardTypes } = useGet("cardTypes");

  const [currentCardsType, setCurrentCardsType] = useState(null);

  const { data: cards, refetch } = useGet(
    "cards",
    {
      filterBy: {
        key: "type",
        value: currentCardsType ? currentCardsType.filter : "",
      },
    },
    false,
  );

  useEffect(() => {
    if (cardTypes && cardTypes.length > 0) {
      setCurrentCardsType(cardTypes[0]);
    }
  }, [cardTypes]);

  useEffect(() => {
    if (currentCardsType) {
      refetch();
    }
  }, [currentCardsType]);

  const renderBlocks = () => {
    return blocks.map((block, index) => {
      switch (block.type) {
        case "banners": {
          return (
            banners &&
            banners.length > 0 && (
              <Carousel
                key={`block-${index}`}
                slides={banners.map((banner) => (
                  <BannerSlide
                    card={{
                      image: `${banner.imageUrl}`,
                      name: banner.name,
                      description: banner.description,
                      provider: banner.provider,
                      href: "",
                    }}
                  />
                ))}
                autoPlay={false}
              />
            )
          );
        }
        case "cards": {
          return (
            currentCardsType && (
              <CardList
                key={`block-${index}`}
                items={cards.map((card) => ({
                  name: card.name,
                  status: card.status,
                  image: card.imageUrl,
                }))}
                icon={`${process.env.REACT_APP_API_URL}${currentCardsType.icon}`}
                name={currentCardsType.name}
                itemsPerView={10}
              />
            )
          );
        }
        case "cardTypes": {
          return (
            <NavList
              key={`block-${index}`}
              items={cardTypes.map((cardType) => ({
                icon: `${cardType.icon}`,
                name: cardType.name,
                filter: cardType.filter,
              }))}
              onClick={(filter) => setCurrentCardsType(filter)}
            />
          );
        }
        default:
          <p>Blocks Not Found</p>;
      }
    });
  };

  return (
    <div
      className="page"
      style={{
        background: color && color.length > 0 ? color[0].value : "#FFF",
      }}
    >
      {renderBlocks()}
    </div>
  );
}
