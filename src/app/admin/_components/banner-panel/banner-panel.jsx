import { bannerHeaderNames } from "./banner-panel.data";
import "./banner-panel.scss";
import { useEffect, useRef } from "react";
import { useBannerAPI } from "../../../_utils/hooks/useBannerAPI";
import { IMAGE_LIBRARY } from "../../../common/select/select.data";
import Table from "src/app/common/table";

export default function BannerPanel({ entityType = "banners", entityApiName }) {
  const tableRef = useRef(null);
  const {
    handleSave,
    entity: banners,
    getEditMode,
  } = useBannerAPI(entityType, entityApiName);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tableRef.current && !tableRef.current.contains(event.target)) {
        handleSave(getEditMode(entityType).id);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="banner-panel" ref={tableRef}>
      <Table
        addEntity={{
          name: "",
          provider: "",
          description: "",
          imageUrl: "",
        }}
        table={{
          header: bannerHeaderNames,
          body: banners.map((cardType) => {
            const entries = Object.entries(cardType);
            return entries.map(([key, value]) => ({
              type:
                key === "name" || key === "provider" || key === "description"
                  ? "input"
                  : key === "imageUrl"
                    ? "select"
                    : "label",
              propertyName: key,
              values: value,
              options:
                key === "imageUrl"
                  ? IMAGE_LIBRARY.banners.map((banner) => ({
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
        title="All Cards"
      />
    </div>
  );
}
