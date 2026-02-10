import { useEffect, useState } from "react";
import { useAdminStore } from "../stores/useAdminStore";
import { SettingsMode } from "../enums/settings";
import { useGet } from "./useGet";
import { useUpdate } from "./useUpdate";
import { usePost } from "./usePost";
import { useDelete } from "./useDelete";
import { api } from "src/server/app";

export const useBannerAPI = (entityType, entityApiName) => {
  const { data: entityData, refetch } = useGet(entityApiName);
  const { fetch: update } = useUpdate();
  const { fetch: post } = usePost();
  const { fetch: remove } = useDelete();

  const {
    getTableData,
    setData,
    getEditMode,
    setEditMode,
    updateFieldByIndex,
    addItem,
    moveItemUp,
    moveItemDown,
    deleteItemByIndex,
  } = useAdminStore((state) => state);

  const [buffer, setBuffer] = useState([]);

  const entity = getTableData(entityType);

  useEffect(() => {
    if (entityData && Array.isArray(entityData)) {
      setData(entityType, entityData);
    }
  }, [entityData]);
  const handleEdit = (id) => {
    setEditMode(entityType, id, SettingsMode.EDIT);
  };
  const handleSave = async (id) => {
    switch (getEditMode(entityType).mode) {
      case SettingsMode.EDIT: {
        await update(entityApiName, id, entity[id]);
        break;
      }
      case SettingsMode.ADD: {
        await post(entityApiName, entity[id]);
        break;
      }
      case SettingsMode.COPY: {
        const preparedBuffer = buffer.map((item, index) => ({
          ...item,
          id: `${entity.length + index}`,
        }));
        await api.postMany(entityApiName, preparedBuffer);
        break;
      }
      default: {
        setEditMode(entityType, -1, SettingsMode.VIEW);
      }
    }
    setBuffer([]);
    setEditMode(entityType, -1, SettingsMode.VIEW);
    refetch();
  };

  const handleAdd = (item) => {
    const id = entity.length;
    addItem(entityType, { id: `${id}`, ...item });
    setEditMode(entityType, id, SettingsMode.ADD);
  };

  const handleCancel = () => {
    setEditMode(entityType, -1, SettingsMode.VIEW);
    if (entityData) {
      setData(entityType, [...entityData]);
    }
  };

  const handleDelete = (id) => {
    deleteItemByIndex(entityType, id);
    remove(entityApiName, id);
  };

  const handleMoveUp = async (index) => {
    if (index === 0) return;
    moveItemUp(entityType, index);
    setEditMode(entityType, index, SettingsMode.ORDER);
  };

  const handleMoveDown = async (index) => {
    if (index === entity.length - 1) return;
    moveItemDown(entityType, index);
    setEditMode(entityType, index, SettingsMode.ORDER);
  };
  const handleCopy = async () => {
    setEditMode(entityType, -1, SettingsMode.COPY);
  };

  useEffect(() => {
    if (
      getEditMode(entityType) &&
      getEditMode(entityType).mode === SettingsMode.ORDER
    ) {
      updateAllBannersOnServer(entity);
    }
  }, [entity]);

  const updateAllBannersOnServer = async (bannersArray) => {
    console.log(bannersArray);
    try {
      for (let i = 0; i < bannersArray.length; i++) {
        const banner = bannersArray[i];
        await update(entityApiName, i, banner);
      }
    } catch (error) {
      console.error("Failed to update all banners:", error);
      throw error;
    } finally {
      setEditMode(entityType, -1, SettingsMode.VIEW);
      refetch();
    }
  };

  const isEdit = (index) => {
    return (
      getEditMode(entityType) &&
      getEditMode(entityType).mode &&
      (getEditMode(entityType).mode === SettingsMode.EDIT ||
        getEditMode(entityType).mode === SettingsMode.ADD) &&
      getEditMode(entityType).id === index
    );
  };

  const handleDeleteMany = async () => {
    const ids = buffer.map((item) => item.id);
    try {
      await api.deleteMany(entityApiName, ids);
    } catch (err) {
      console.error(err.message);
    } finally {
      setEditMode(entityType, -1, SettingsMode.VIEW);
      setBuffer([]);
      refetch();
    }
  };

  const handleOnChange = (value, fieldName, index) => {
    updateFieldByIndex(entityType, index, fieldName, value);
  };

  const copySettings = {
    handleCancel: () => {
      setEditMode(entityType, -1, SettingsMode.VIEW);
      setBuffer([]);
    },
    handleRemoveAll: () => {
      handleDeleteMany();
    },
    handleConfirm: () => {
      handleSave();
    },
    handleCheckboxSelect: (id, checked) => {
      if (checked) {
        setBuffer([...buffer, entity[id]]);
      } else {
        const filteredBuffer = buffer.filter((item) => +item.id !== id);
        setBuffer(filteredBuffer);
      }
    },
  };

  return {
    handleAdd,
    handleEdit,
    handleDelete,
    handleCancel,
    handleOnChange,
    isEdit,
    handleMoveDown,
    handleMoveUp,
    handleSave,
    handleCopy,
    entity,
    getEditMode,
    copySettings,
  };
};
