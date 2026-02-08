import { useGet } from "../../../_utils/hooks/useGet";
import { bannerHeaderNames, bannerTableIcons } from "./banner-panel.data";
import "./banner-panel.scss";
import { useEffect, useRef, useState } from "react";
import Input from "../../../common/input";
import { useUpdate } from "../../../_utils/hooks/useUpdate";
import { useBannerStore } from "../../../_utils/stores/useBannerStore";
import Select from "../../../common/select";
import { usePost } from "../../../_utils/hooks/usePost";
import { SettingsMode } from "../../../_utils/enums/settings";
import { useDelete } from "../../../_utils/hooks/useDelete";
import { api } from "../../../../server/app";

export default function BannerPanel() {
  const { data } = useGet("banner");
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

  const handleSave = (id) => {
    console.log("Saving row:", banners[id], `id: ${id}`, editMode);
    switch (editMode.mode) {
      case SettingsMode.EDIT: {
        update("banner", id, banners[id]);
        break;
      }
      case SettingsMode.ADD: {
        post("banner", banners[id]);
        break;
      }
      default: {
        setEditMode(-1, SettingsMode.VIEW);
      }
    }
    setEditMode(-1, SettingsMode.VIEW);
  };

  const handleAdd = () => {
    const id = banners.length;
    addBanner({
      id: id,
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
  const [pendingOrder, setPendingOrder] = useState([]);

  const handleMoveUp = (index) => {
    if (index === 0) return;

    const newBanners = [...banners];
    [newBanners[index], newBanners[index - 1]] = [
      newBanners[index - 1],
      newBanners[index],
    ];

    // Только локально, без сервера
    setBanners(newBanners);
    setPendingOrder(newBanners); // Сохраняем для возможного сохранения
  };

  const handleMoveDown = async (index) => {
    if (index === banners.length - 1) return;

    const newBanners = [...banners];
    [newBanners[index], newBanners[index + 1]] = [
      newBanners[index + 1],
      newBanners[index],
    ];

    setBanners(newBanners);

    try {
      await api.replaceAll("banner", newBanners);
      console.log("Order saved to server");
    } catch (error) {
      console.error("Failed to save order:", error);
    }
  };

  const handleDelete = (index) => {
    const banner = banners[index];
    deleteBanner(index);
    remove("banner", banner.id);
  };
  // Добавь эту функцию в компонент
  const updateAllBannersOnServer = async (bannersArray) => {
    try {
      // Сначала удаляем все старые
      const currentBanners = await api.get("banner");
      for (const banner of currentBanners) {
        await api.delete("banner", banner.id);
      }

      // Затем создаём новые с новыми ID
      for (const banner of bannersArray) {
        await api.post("banner", banner);
      }

      return true;
    } catch (error) {
      console.error("Failed to update all banners:", error);
      throw error;
    }
  };

  // Кнопка для сохранения порядка
  const handleSaveOrder = async () => {
    // Перенумеровываем ID
    const renumberedBanners = banners.map((banner, idx) => ({
      ...banner,
      id: idx,
    }));

    try {
      await updateAllBannersOnServer(renumberedBanners);
      setBanners(renumberedBanners); // Обновляем локально с новыми ID
      alert("Order saved successfully!");
    } catch (error) {
      alert("Failed to save order");
    }
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
          <button
            className="banner-panel-main-options-button save-order"
            onClick={handleSaveOrder}
            style={{ background: "#3498db" }}
          >
            Save Order
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
                    value={banners[index].name}
                    onChange={(value) =>
                      updateBannerField(index, "name", value)
                    }
                    readOnly={!(editMode.mode && editMode.id === index)}
                    className="table-input-name"
                  />
                </td>
                <td className="banner-panel-main-table-body-row-item">
                  <Select
                    value={banners[index].imageUrl}
                    readOnly={
                      !(
                        editMode.mode &&
                        editMode.mode !== SettingsMode.VIEW &&
                        editMode.id === index
                      )
                    }
                    onChange={(value) => {
                      updateBannerField(index, "imageUrl", value);
                    }}
                  />
                </td>
                <td className="banner-panel-main-table-body-row-item">
                  <div className="banner-panel-main-table-body-row-item-actions">
                    {editMode &&
                    editMode.mode !== SettingsMode.VIEW &&
                    editMode.id === index ? (
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
                {/* Колонка с кнопками перемещения */}
                <td className="banner-panel-main-table-body-row-item order-cell">
                  <div className="order-controls">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="order-btn up-btn"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <span className="position-number">{index + 1}</span>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === banners.length - 1}
                      className="order-btn down-btn"
                      title="Move down"
                    >
                      ↓
                    </button>
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
