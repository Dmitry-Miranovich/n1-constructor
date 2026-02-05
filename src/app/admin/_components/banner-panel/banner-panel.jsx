import { useGet } from "../../../_utils/hooks/useGet";
import "./banner-panel.scss";
import { useEffect } from "react";

export default function BannerPanel() {
  const { data } = useGet("banner");
  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <div className="banner-panel">
      <div className="banner-panel-controller"></div>
      <div className="banner-panel-main">
        <table className="banner-panel-main-table"></table>
      </div>
    </div>
  );
}
