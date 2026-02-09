import { create } from "zustand";
import { SettingsMode } from "../enums/settings";

// useBannerStore.js - добавь эти функции
export const useBannerStore = create((set) => ({
  banners: [],
  editMode: {
    id: -1,
    mode: SettingsMode.VIEW,
  },
  setBanners: (newBanners) => set({ banners: newBanners }),

  setEditBanner: (banner) => set({ editBanner: banner }),

  updateBannerField: (rowId, field, newValue) =>
    set((state) => ({
      banners: state.banners.map((row, index) =>
        index === rowId ? { ...row, [field]: newValue } : row,
      ),
    })),

  setEditMode: (id, mode) =>
    set({
      editMode: { id, mode },
    }),

  addBanner: (banner) =>
    set((state) => ({ banners: [...state.banners, banner] })),

  moveBannerUp: (index) =>
    set((state) => {
      if (index <= 0) return state;

      const newBanners = [...state.banners];
      [newBanners[index], newBanners[index - 1]] = [
        newBanners[index - 1],
        newBanners[index],
      ];

      const renumberedBanners = newBanners.map((banner, idx) => ({
        ...banner,
        id: idx,
      }));

      return { banners: renumberedBanners };
    }),

  moveBannerDown: (index) =>
    set((state) => {
      if (index >= state.banners.length - 1) return state;

      const newBanners = [...state.banners];
      [newBanners[index], newBanners[index + 1]] = [
        newBanners[index + 1],
        newBanners[index],
      ];

      const renumberedBanners = newBanners.map((banner, idx) => ({
        ...banner,
        id: idx,
      }));

      return { banners: renumberedBanners };
    }),

  deleteBanner: (index) =>
    set((state) => ({
      banners: state.banners.filter((_, i) => i !== index),
    })),
}));
