import { IMAGE_LIBRARY } from "src/app/common/select/select.data";
import { useBannerAPI } from "../../../_utils/hooks/useBannerAPI";
import Table from "../../../common/table";
import { cardsTypesHeader } from "./cards-types-panel.data";
import "./cards-types-panel.scss";
import { useEffect, useRef } from "react";

export default function CardsTypesPanel({ entityType, entityApiName }) {
  const {
    handleSave,
    getEditMode,
    entity: cardsTypes,
  } = useBannerAPI(entityType, entityApiName);

  const tableRef = useRef(null);
  //   useEffect(() => {
  //     const handleClickOutside = (event) => {
  //       if (tableRef.current && !tableRef.current.contains(event.target)) {
  //         handleSave(getEditMode(entityType).id);
  //       }
  //     };

  //     document.addEventListener("mousedown", handleClickOutside);
  //     return () => {
  //       document.removeEventListener("mousedown", handleClickOutside);
  //     };
  //   }, []);

  /**
   * "id": "0",
      "name": "John Doe",
      "icon": "",
      "filter": ""
   */
  return (
    <div className="cards-types-panel" ref={tableRef}>
      {cardsTypes && (
        <Table
          addEntity={{
            name: "",
            icon: "",
            filter: "",
          }}
          table={{
            header: cardsTypesHeader,
            body: cardsTypes.map((cardType) => {
              const entries = Object.entries(cardType);
              return entries.map(([key, value]) => ({
                type:
                  key === "name" || key === "filter"
                    ? "input"
                    : key === "icon"
                      ? "select"
                      : "label",
                propertyName: key,
                values: value,
                options:
                  key === "icon"
                    ? IMAGE_LIBRARY.cardTypes.map((banner) => ({
                        value: banner.url,
                        label: banner.label,
                        category: "cardTypes",
                      }))
                    : [],
              }));
            }),
          }}
          entityType={entityType}
          entityApiName={entityApiName}
          title="All Card Types"
        />
      )}
    </div>
  );
}
