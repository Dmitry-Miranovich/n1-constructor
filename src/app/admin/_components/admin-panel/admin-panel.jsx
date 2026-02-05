import { useMemo } from "react";
import "./admin-panel.scss";
import { SIDEBAR_TYPES } from "../sidebar/sidebar.data";
import BannerPanel from "../banner-panel";

export default function AdminPanel({ type }) {
  const renderPanel = useMemo(() => {
    switch (type) {
      case SIDEBAR_TYPES[0]: {
        return <BannerPanel />;
      }
      case SIDEBAR_TYPES[1]: {
        return;
      }
      case SIDEBAR_TYPES[2]: {
        return;
      }
      default:
        return null;
    }
  }, [type]);
  return <div className="admin-panel">{renderPanel}</div>;
}
