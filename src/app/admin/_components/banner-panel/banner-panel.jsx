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

export default function BannerPanel({ entityType = "banner" }) {
  const { data, refetch } = useGet(entityType);
  const { fetch: update } = useUpdate();
  const { fetch: post } = usePost();
  const { fetch: remove } = useDelete();

  const {
    banners,
    setBanners,
    editMode,
    setEditMode,
    updateBannerField,
    addBanner,
    moveBannerUp,
    moveBannerDown,
    deleteBanner,
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
        handleSave(editMode.id);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEdit = (id) => {
    setEditMode(id, SettingsMode.EDIT);
  };

  const handleSave = async (id) => {
    // console.log("Saving row:", banners[id], `id: ${id}`, editMode);
    switch (editMode.mode) {
      case SettingsMode.EDIT: {
        await update("banner", id, banners[id]);
        break;
      }
      case SettingsMode.ADD: {
        await post("banner", banners[id]);
        break;
      }
      default: {
        setEditMode(-1, SettingsMode.VIEW);
      }
    }

    setEditMode(-1, SettingsMode.VIEW);
    refetch();
  };

  const handleAdd = () => {
    const id = banners.length;
    addBanner({
      id: `${id}`,
      name: "",
      imageUrl: "",
    });
    setEditMode(id, SettingsMode.ADD);
  };

  const handleCancel = () => {
    setEditMode({ id: -1, mode: SettingsMode.VIEW });
    if (data) {
      setBanners([...data]);
    }
  };

  const handleDelete = (id) => {
    deleteBanner(id);
    remove("banner", id);
  };

  const handleMoveUp = async (index) => {
    if (index === 0) return;
    moveBannerUp(index);
    setEditMode(index, SettingsMode.ORDER);
  };

  const handleMoveDown = async (index) => {
    if (index === banners.length - 1) return;
    moveBannerDown(index);
    setEditMode(index, SettingsMode.ORDER);
  };

  useEffect(() => {
    if (editMode.mode === SettingsMode.ORDER) {
      updateAllBannersOnServer(banners);
    }
  }, [banners]);

  const updateAllBannersOnServer = async (bannersArray) => {
    console.log(bannersArray);
    try {
      for (let i = 0; i < bannersArray.length; i++) {
        const banner = bannersArray[i];
        await update("banner", i, banner);
      }
      console.log("All banners updated on server");
    } catch (error) {
      console.error("Failed to update all banners:", error);
      throw error;
    }
  };

  const isEdit = (index) => {
    return (
      editMode.mode &&
      editMode.mode === SettingsMode.EDIT &&
      editMode.id === index
    );
  };

  return (
    <div className="banner-panel" ref={tableRef}>
      <div className="banner-panel-controller"></div>
      <div className="banner-panel-main">
        <div className="banner-panel-main-options">
          <p className="banner-panel-main-options-title">All Banners</p>
          <button
            className="banner-panel-main-options-button add"
            onClick={() => handleAdd()}
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
                    onChange={(value) =>
                      updateBannerField(index, "name", value)
                    }
                    readOnly={!isEdit(index)}
                    className="table-input-name"
                  />
                </td>
                <td className="banner-panel-main-table-body-row-item">
                  <Select
                    value={banners[index].imageUrl}
                    readOnly={!isEdit(index)}
                    onChange={(value) => {
                      updateBannerField(index, "imageUrl", value);
                    }}
                  />
                </td>
                <td className="banner-panel-main-table-body-row-item">
                  <div className="banner-panel-main-table-body-row-item-actions">
                    {isEdit() ? (
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
                  {/* Кнопки перемещения */}
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
