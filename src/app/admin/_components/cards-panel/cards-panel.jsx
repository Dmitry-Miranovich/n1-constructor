import { useBannerAPI } from "src/app/_utils/hooks/useBannerAPI";
import "./cards-panel.scss";
import { useRef } from "react";
import Table from "src/app/common/table";
import { IMAGE_LIBRARY } from "src/app/common/select/select.data";
import { useGet } from "src/app/_utils/hooks/useGet";
import { cardsHeader, cardsStatus } from "./cards-panel.data";

export default function CardsPanel({ entityType, entityApiName }) {
  const { entity: cardsTypes } = useBannerAPI(entityType, entityApiName);
  const { data: cardTypes } = useGet("cardTypes");
  const tableRef = useRef(null);
  return (
    <div className="cards-types-panel" ref={tableRef}>
      {cardsTypes && (
        <Table
          addEntity={{
            name: "",
            imageUrl: "",
            type: "",
            status: cardsStatus[0].value,
            href: "",
          }}
          table={{
            header: cardsHeader,
            body: cardsTypes.map((cardType) => {
              const entries = Object.entries(cardType);
              return entries.map(([key, value]) => ({
                type:
                  key === "name" || key === "href"
                    ? "input"
                    : key === "imageUrl" || key === "type" || key === "status"
                      ? "select"
                      : "label",
                propertyName: key,
                values: value,
                options:
                  key === "imageUrl"
                    ? IMAGE_LIBRARY.cards.map((banner) => ({
                        value: banner.url,
                        label: banner.label,
                        category: "cardTypes",
                      }))
                    : key === "type"
                      ? cardTypes.map((cardType) => ({
                          value: cardType.filter,
                          label: cardType.name,
                          category: "cardTypes",
                        }))
                      : key === "status"
                        ? cardsStatus.map((cardStatus) => ({
                            value: cardStatus.value,
                            label: cardStatus.label,
                            category: "status",
                          }))
                        : [],
              }));
            }),
          }}
          entityType={entityType}
          entityApiName={entityApiName}
          title="All Cards"
        />
      )}
    </div>
  );
}
