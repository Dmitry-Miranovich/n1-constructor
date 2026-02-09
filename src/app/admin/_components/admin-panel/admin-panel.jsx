import { useMemo } from "react";
import "./admin-panel.scss";
import { SIDEBAR_TYPES } from "../sidebar/sidebar.data";
import BannerPanel from "../banner-panel";
import CardsTypesPanel from "../cards-types-panel/cards-types-panel";
import CardsPanel from "../cards-panel";
import MainPanel from "../main-panel";

export default function AdminPanel({ type }) {
  const renderPanel = useMemo(() => {
    switch (type) {
      case SIDEBAR_TYPES[0]: {
        return <MainPanel entityType="blocks" entityApiName="blocks" />;
      }
      case SIDEBAR_TYPES[1]: {
        return <BannerPanel entityType="banners" entityApiName={"banner"} />;
      }
      case SIDEBAR_TYPES[2]: {
        return (
          <CardsTypesPanel
            entityType={"cardTypes"}
            entityApiName={"cardTypes"}
          />
        );
      }
      case SIDEBAR_TYPES[3]: {
        return <CardsPanel entityType={"cards"} entityApiName={"cards"} />;
      }
      default:
        return null;
    }
  }, [type]);
  return <div className="admin-panel">{renderPanel}</div>;
}
