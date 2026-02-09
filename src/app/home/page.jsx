import Carousel from "../common/carousel";
import "./page.scss";
import NavList from "../common/nav-list/nav-list";
import { useGet } from "../_utils/hooks/useGet";
import CardList from "../common/card-list/card-list";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    console.log(cards);
  }, [cards]);

  const renderBlocks = () => {
    return blocks.map((block, index) => {
      switch (block.type) {
        case "banners": {
          return (
            banners &&
            banners.length > 0 && (
              <Carousel
                key={`block-${index}`}
                images={banners.map((banner) => ({
                  src: `${process.env.REACT_APP_API_URL}${banner.imageUrl}`,
                  value: banner.name,
                  href: "",
                }))}
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
