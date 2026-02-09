import { useEffect } from "react";
import { useAdminStore } from "../stores/useAdminStore";
import { SettingsMode } from "../enums/settings";
import { useGet } from "./useGet";
import { useUpdate } from "./useUpdate";
import { usePost } from "./usePost";
import { useDelete } from "./useDelete";

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
      default: {
        setEditMode(entityType, -1, SettingsMode.VIEW);
      }
    }

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
      console.log("All banners updated on server");
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

  const handleOnChange = (value, fieldName, index) => {
    updateFieldByIndex(entityType, index, fieldName, value);
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
    entity,
    getEditMode,
  };
};
