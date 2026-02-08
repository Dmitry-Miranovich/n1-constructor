import { create } from "zustand";
import { SettingsMode } from "../enums/settings";

export const useAdminStore = create((set, get) => ({
  // === ДАННЫЕ ВСЕХ ТИПОВ ===
  banners: [],
  cards: [],
  cardTypes: [],

  // === СОСТОЯНИЕ РЕДАКТИРОВАНИЯ ДЛЯ КАЖДОГО ТИПА ===
  editModes: {
    banners: { id: -1, mode: SettingsMode.VIEW },
    cards: { id: -1, mode: SettingsMode.VIEW },
    cardTypes: { id: -1, mode: SettingsMode.VIEW },
  },

  // === УНИВЕРСАЛЬНЫЕ МЕТОДЫ ===

  // Установить данные для типа
  setData: (entityType, data) => set({ [entityType]: data }),

  // Обновить поле в элементе
  updateField: (entityType, id, field, value) =>
    set((state) => ({
      [entityType]: state[entityType].map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    })),

  // Добавить новый элемент
  addItem: (entityType, item) =>
    set((state) => ({
      [entityType]: [...state[entityType], { ...item, id: Date.now() }],
    })),

  // Удалить элемент
  deleteItem: (entityType, id) =>
    set((state) => ({
      [entityType]: state[entityType].filter((item) => item.id !== id),
    })),

  // Установить режим редактирования
  setEditMode: (entityType, id, mode) =>
    set((state) => ({
      editModes: {
        ...state.editModes,
        [entityType]: { id, mode },
      },
    })),

  // Получить редактируемый элемент
  getEditingItem: (entityType) => {
    const state = get();
    const editMode = state.editModes[entityType];
    if (editMode.id === -1) return null;

    return state[entityType].find((item) => item.id === editMode.id);
  },

  // === СЕЛЕКТОРЫ ДЛЯ ТАБЛИЦ ===

  // Получить данные для таблицы
  getTableData: (entityType) => {
    const state = get();
    return state[entityType];
  },

  // Получить режим редактирования для таблицы
  getEditMode: (entityType) => {
    const state = get();
    return state.editModes[entityType];
  },
}));
