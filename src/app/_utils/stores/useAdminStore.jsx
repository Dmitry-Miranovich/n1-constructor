import { create } from "zustand";
import { SettingsMode } from "../enums/settings";

export const useAdminStore = create((set, get) => ({
  // === ДАННЫЕ ВСЕХ ТИПОВ ===
  banners: [],
  cards: [],
  cardTypes: [],
  blocks: [],
  color: "",

  // === СОСТОЯНИЕ РЕДАКТИРОВАНИЯ ДЛЯ КАЖДОГО ТИПА ===
  editModes: {
    banners: { id: -1, mode: SettingsMode.VIEW },
    cards: { id: -1, mode: SettingsMode.VIEW },
    cardTypes: { id: -1, mode: SettingsMode.VIEW },
    blocks: { id: -1, mode: SettingsMode.VIEW },
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
      [entityType]: [...state[entityType], { ...item }],
    })),

  deleteItem: (entityType, id) =>
    set((state) => ({
      [entityType]: state[entityType].filter((item) => item.id !== id),
    })),

  deleteItemByIndex: (entityType, index) =>
    set((state) => ({
      [entityType]: state[entityType].filter((_, i) => i !== index),
    })),

  updateFieldByIndex: (entityType, index, field, value) =>
    set((state) => ({
      [entityType]: state[entityType].map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    })),

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

  moveItemUp: (entityType, index) =>
    set((state) => {
      if (index <= 0) return state;

      const items = [...state[entityType]];
      [items[index], items[index - 1]] = [items[index - 1], items[index]];

      // Переиндексируем если нужно
      const renumberedItems = items.map((item, idx) => ({
        ...item,
        id: idx,
      }));

      return { [entityType]: renumberedItems };
    }),

  moveItemDown: (entityType, index) =>
    set((state) => {
      if (index >= state[entityType].length - 1) return state;

      const items = [...state[entityType]];
      [items[index], items[index + 1]] = [items[index + 1], items[index]];

      const renumberedItems = items.map((item, idx) => ({
        ...item,
        id: idx,
      }));

      return { [entityType]: renumberedItems };
    }),

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
