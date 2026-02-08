import { useGet } from "../../../_utils/hooks/useGet";
import { bannerHeaderNames, bannerTableIcons } from "./banner-panel.data";
import "./banner-panel.scss";
import { useEffect, useRef } from "react";
import Input from "../../../common/input";
import { useUpdate } from "../../../_utils/hooks/useUpdate";
import { useBannerStore } from "../../../_utils/stores/useBannerStore";

export default function BannerPanel() {
  const { data } = useGet("banner");
  const { fetch } = useUpdate();

  const {
    banners,
    setBanners,
    editMode,
    setEditMode,
    editBanner,
    updateEditBannerField,
  } = useBannerStore((state) => state);

  const tableRef = useRef(null);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setBanners(data);
    }
  }, [data]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tableRef.current && !tableRef.current.contains(event.target)) {
        setEditMode({ id: -1, mode: false });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEdit = (id) => {
    setEditMode(id, true);
  };

  const handleSave = (id) => {
    console.log("Saving row:", editBanner[id]);
    setEditMode(-1, false);
  };

  const handleCancel = () => {
    setEditMode({ id: -1, mode: false });
    if (data) {
      setBanners([...data]);
    }
  };
  return (
    <div className="banner-panel" ref={tableRef}>
      <div className="banner-panel-controller"></div>
      <div className="banner-panel-main">
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
            </tr>
          </thead>
          <tbody className="banner-panel-main-table-body">
            {banners.map((row, index) => (
              <tr
                className="banner-panel-main-table-body-row"
                key={`row-${index}`}
              >
                <td className="banner-panel-main-table-body-row-item">
                  {+row.id + 1}
                </td>
                <td className="banner-panel-main-table-body-row-item">
                  <Input
                    value={row.name}
                    onChange={(value) =>
                      updateEditBannerField(index, "name", value)
                    }
                    readOnly={!(editMode.mode && editMode.id === index)}
                    className="table-input-name"
                  />
                </td>
                <td className="banner-panel-main-table-body-row-item"></td>
                <td className="banner-panel-main-table-body-row-item">
                  <div className="banner-panel-main-table-body-row-item-actions">
                    {editMode && editMode.mode && editMode.id === index ? (
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
                        <button className="banner-panel-main-table-body-row-item-actions-item">
                          <img src={bannerTableIcons.remove} alt="Remove" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
