import { useRef } from "react";
import "./main-panel.scss";
import { useBannerAPI } from "src/app/_utils/hooks/useBannerAPI";
import Table from "src/app/common/table";
import { blocksTypes, mainPanelHeader } from "./main-panel.data";
import MainPanelOptions from "./_components/main-panel-options/main-panel-options";

export default function MainPanel({ entityType, entityApiName }) {
  const { entity: cardsTypes } = useBannerAPI(entityType, entityApiName);
  const tableRef = useRef(null);
  return (
    <div className="main-panel" ref={tableRef}>
      {cardsTypes && (
        <Table
          addEntity={{
            name: "",
          }}
          table={{
            header: mainPanelHeader,
            body: cardsTypes.map((cardType) => {
              const entries = Object.entries(cardType);
              return entries.map(([key, value]) => ({
                type: key === "type" ? "select" : "label",
                propertyName: key,
                values: value,
                options:
                  key === "type"
                    ? blocksTypes.map((block) => ({
                        value: block.value,
                        label: block.label,
                        category: "blocks",
                      }))
                    : [],
              }));
            }),
          }}
          entityType={entityType}
          entityApiName={entityApiName}
          title="Components on the Main Page"
          options={
            <MainPanelOptions
              title={`Components on the Main Page`}
              entityType={"color"}
              entityApiName={"color"}
            />
          }
        />
      )}
    </div>
  );
}
