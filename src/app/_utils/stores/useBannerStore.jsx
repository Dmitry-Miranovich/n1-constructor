import { create } from "zustand";
import { SettingsMode } from "../enums/settings";

// useBannerStore.js - добавь эти функции
export const useBannerStore = create((set) => ({
  banners: [],
  editMode: {
    id: -1,
    mode: SettingsMode.VIEW,
  },
  editBanner: null,

  setBanners: (newBanners) => set({ banners: newBanners }),

  setEditBanner: (banner) => set({ editBanner: banner }),

  updateBannerField: (rowId, field, newValue) =>
    set((state) => ({
      banners: state.banners.map((row, index) =>
        index === rowId ? { ...row, [field]: newValue } : row,
      ),
    })),

  updateEditBannerField: (field, newValue) => {
    set((state) => ({
      editBanner: state.editBanner
        ? { ...state.editBanner, [field]: newValue }
        : null,
    }));
  },

  setEditMode: (id, mode) =>
    set({
      editMode: { id, mode },
    }),

  addBanner: (banner) =>
    set((state) => ({ banners: [...state.banners, banner] })),

  // НОВЫЕ ФУНКЦИИ ДЛЯ ПЕРЕМЕЩЕНИЯ
  moveBannerUp: (index) =>
    set((state) => {
      if (index <= 0) return state; // Нельзя поднять первую строку
      const newBanners = [...state.banners];
      // Меняем местами текущий и предыдущий элемент
      [newBanners[index], newBanners[index - 1]] = [
        newBanners[index - 1],
        newBanners[index],
      ];
      return { banners: newBanners };
    }),

  moveBannerDown: (index) =>
    set((state) => {
      if (index >= state.banners.length - 1) return state; // Нельзя опустить последнюю
      const newBanners = [...state.banners];
      // Меняем местами текущий и следующий элемент
      [newBanners[index], newBanners[index + 1]] = [
        newBanners[index + 1],
        newBanners[index],
      ];
      return { banners: newBanners };
    }),

  // Удаление
  deleteBanner: (index) =>
    set((state) => ({
      banners: state.banners.filter((_, i) => i !== index),
    })),
}));
