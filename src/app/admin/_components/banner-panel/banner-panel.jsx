import { useGet } from "../../../_utils/hooks/useGet";
import { bannerHeaderNames, bannerTableIcons } from "./banner-panel.data";
import "./banner-panel.scss";
import { useEffect, useRef } from "react";
import Input from "../../../common/input";
import { useUpdate } from "../../../_utils/hooks/useUpdate";
import { useBannerStore } from "../../../_utils/stores/useBannerStore";
import Select from "../../../common/select";
import { usePost } from "../../../_utils/hooks/usePost";
import { SettingsMode } from "../../../_utils/enums/settings";
import { useDelete } from "../../../_utils/hooks/useDelete";
import { useAdminStore } from "../../../_utils/stores/useAdminStore";
import { useBannerAPI } from "../../../_utils/hooks/useBannerAPI";
import { IMAGE_LIBRARY } from "../../../common/select/select.data";

export default function BannerPanel({ entityType = "banners" }) {
  const tableRef = useRef(null);
  const {
    handleAdd,
    handleCancel,
    handleDelete,
    handleEdit,
    handleMoveDown,
    handleMoveUp,
    handleOnChange,
    handleSave,
    entity: banners,
    getEditMode,
    isEdit,
  } = useBannerAPI(entityType, "banner");
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
      <div className="banner-panel-controller"></div>
      <div className="banner-panel-main">
        <div className="banner-panel-main-options">
          <p className="banner-panel-main-options-title">All Banners</p>
          <button
            className="banner-panel-main-options-button add"
            onClick={() =>
              handleAdd({
                name: "",
                imageUrl: "",
              })
            }
          >
            Add
          </button>
        </div>
        <table className="banner-panel-main-table">
          <thead className="banner-panel-main-table-header">
            <tr className="banner-panel-main-table-header-row">
              {bannerHeaderNames.map((item, key) => (
                <th
                  className="banner-panel-main-table-header-row-item"
                  key={`banner-header-item-${key}`}
                >
                  {item}
                </th>
              ))}
              <th className="banner-panel-main-table-header-row-item order-header">
                Order
              </th>
            </tr>
          </thead>
          <tbody className="banner-panel-main-table-body">
            {banners.map((_, index) => (
              <tr
                className="banner-panel-main-table-body-row"
                key={`row-${index}`}
              >
                <td className="banner-panel-main-table-body-row-item">
                  {index + 1}
                </td>
                <td className="banner-panel-main-table-body-row-item">
                  <Input
                    value={banners[index].name}
                    onChange={(value) => handleOnChange(value, "name", index)}
                    readOnly={!isEdit(index)}
                    className="table-input-name"
                  />
                </td>
                <td className="banner-panel-main-table-body-row-item">
                  <Select
                    value={banners[index].imageUrl}
                    options={IMAGE_LIBRARY.banners.map((banner) => ({
                      value: banner.url,
                      label: banner.label,
                      category: "banner",
                    }))}
                    readOnly={!isEdit(index)}
                    onChange={(value) => {
                      handleOnChange(value, "imageUrl", index);
                    }}
                  />
                </td>
                <td className="banner-panel-main-table-body-row-item">
                  <div className="banner-panel-main-table-body-row-item-actions">
                    {isEdit(index) ? (
                      <>
                        <button
                          onClick={() => handleSave(index)}
                          className="banner-panel-main-table-body-row-item-actions-item"
                        >
                          <img src={bannerTableIcons.check} alt="Save" />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="banner-panel-main-table-body-row-item-actions-item"
                        >
                          <img src={bannerTableIcons.clear} alt="Cancel" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(index)}
                          className="banner-panel-main-table-body-row-item-actions-item"
                        >
                          <img src={bannerTableIcons.edit} alt="Edit" />
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="banner-panel-main-table-body-row-item-actions-item"
                        >
                          <img src={bannerTableIcons.remove} alt="Remove" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
                <td className="banner-panel-main-table-body-row-item">
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="banner-panel-main-table-body-row-item-actions-item move-btn"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === banners.length - 1}
                    className="banner-panel-main-table-body-row-item-actions-item move-btn"
                    title="Move down"
                  >
                    ↓
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
