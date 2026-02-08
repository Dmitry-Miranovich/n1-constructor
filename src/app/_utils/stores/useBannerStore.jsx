import { create } from "zustand";

export const useBannerStore = create((set) => ({
  banners: [],
  editMode: {
    id: -1,
    mode: false,
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

  updateEditBannerField: (field, newValue) =>
    set((state) => ({
      editBanner: state.editBanner
        ? { ...state.editBanner, [field]: newValue }
        : null,
    })),

  setEditMode: (id, mode) =>
    set({
      editMode: { id, mode },
    }),
}));
