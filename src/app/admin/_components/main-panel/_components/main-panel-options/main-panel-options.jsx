import { useEffect, useState } from "react";
import "./main-panel-options.scss";
import { useAdminStore } from "src/app/_utils/stores/useAdminStore";
import { usePost } from "src/app/_utils/hooks/usePost";
import { useUpdate } from "src/app/_utils/hooks/useUpdate";

export default function MainPanelOptions({ title, entityType, entityApiName }) {
  const { setData, color } = useAdminStore((state) => state);
  const { fetch: update } = useUpdate();
  const onBlur = () => {
    try {
      update("colorBG", "color", {
        id: "color",
        value: color,
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="main-panel-options">
      <p className="main-panel-options-title">{title}</p>
      <div className="main-panel-options-controls">
        <div className="main-panel-options-color-picker">
          <p>Change Main Bg-Color</p>
          <input
            type="color"
            value={color}
            onChange={(color) => {
              setData(entityType, color.target.value);
            }}
            onBlur={onBlur}
          />
        </div>
        {/* Export button (если нужно) */}
        <button
          className="main-panel-options-button download"
          onClick={() => {}}
        >
          Export HTML
        </button>
      </div>
    </div>
  );
}
