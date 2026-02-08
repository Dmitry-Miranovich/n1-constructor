import "./table.scss";
import { useState, useCallback } from "react";

/**
 * @typedef {Object} TableCell
 * @property {string} type - Тип ячейки ('text', 'image', 'select', 'input', etc.)
 * @property {*} value - Значение ячейки
 * @property {string} [field] - Поле для обновления
 * @property {*} [rowId] - ID строки
 * @property {boolean} [editable] - Можно ли редактировать
 * @property {Object} [options] - Опции для select
 * @property {function} [onChange] - Колбэк при изменении
 */

/**
 * @typedef {Object} TableConfig
 * @property {string[]} header - Массив заголовков колонок
 * @property {TableCell[][]} body - Двумерный array ячеек [row][column]
 * @property {boolean} [draggable] - Можно ли перетаскивать строки
 * @property {boolean} [editable] - Режим редактирования таблицы
 */

/**
 * @typedef {Object} TableProps
 * @property {TableConfig} table - Конфигурация таблицы
 * @property {function} [onReorder] - (newOrder: any[]) => void
 * @property {function} [onCellChange] - (rowId, field, value) => void
 * @property {function} [onAction] - (action: string, rowId: any, rowData: any) => void
 * @property {Object} [api] - { fetch: () => Promise, update: (id, data) => Promise, reorder: (ids) => Promise }
 */

/**
 * Универсальный компонент таблицы с drag & drop и API поддержкой
 * @param {TableProps} props - Свойства компонента
 */
export default function Table({
  table,
  onReorder,
  onCellChange,
  onAction,
  api,
}) {
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDragStart = useCallback((e, rowId) => {
    setDraggingId(rowId);
    e.dataTransfer.setData("text/plain", rowId);
    e.currentTarget.style.opacity = "0.5";
  }, []);

  const handleDragOver = useCallback(
    (e, rowId) => {
      e.preventDefault();
      if (rowId !== dragOverId) {
        setDragOverId(rowId);
      }
    },
    [dragOverId],
  );

  const handleDragEnd = useCallback(
    async (e) => {
      e.preventDefault();
      e.currentTarget.style.opacity = "1";

      if (draggingId && dragOverId && draggingId !== dragOverId) {
        try {
          setIsLoading(true);

          // Находим индексы
          const rowIndexMap = new Map();
          table.body.forEach((row, idx) => {
            const rowId = row.find((cell) => cell.rowId)?.rowId;
            if (rowId) rowIndexMap.set(rowId, idx);
          });

          const fromIndex = rowIndexMap.get(draggingId);
          const toIndex = rowIndexMap.get(dragOverId);

          if (fromIndex !== undefined && toIndex !== undefined) {
            // Создаём новый порядок
            const newBody = [...table.body];
            const [movedRow] = newBody.splice(fromIndex, 1);
            newBody.splice(toIndex, 0, movedRow);

            // Извлекаем новые ID в порядке строк
            const newOrderIds = newBody
              .map((row) => row.find((cell) => cell.rowId)?.rowId)
              .filter((id) => id != null);

            // Колбэк для локального store
            if (onReorder) {
              onReorder(newOrderIds);
            }

            // API запрос если есть
            if (api?.reorder) {
              await api.reorder(newOrderIds);
            }
          }
        } catch (error) {
          console.error("Reorder failed:", error);
        } finally {
          setIsLoading(false);
        }
      }

      setDraggingId(null);
      setDragOverId(null);
    },
    [draggingId, dragOverId, table.body, onReorder, api],
  );

  const handleCellChange = useCallback(
    async (rowId, field, value) => {
      // Локальный колбэк
      if (onCellChange) {
        onCellChange(rowId, field, value);
      }

      // API запрос если есть
      if (api?.update) {
        try {
          setIsLoading(true);
          await api.update(rowId, { [field]: value });
        } catch (error) {
          console.error("Update failed:", error);
          // Можно откатить через onCellChange с предыдущим значением
        } finally {
          setIsLoading(false);
        }
      }
    },
    [onCellChange, api],
  );

  const handleAction = useCallback(
    async (action, rowId, rowData) => {
      // Колбэк для компонента
      if (onAction) {
        onAction(action, rowId, rowData);
      }

      // API запросы для действий
      if (api) {
        try {
          setIsLoading(true);
          switch (action) {
            case "delete":
              if (api.delete) await api.delete(rowId);
              break;
            case "save":
              if (api.update) await api.update(rowId, rowData);
              break;
            case "add":
              if (api.create) await api.create(rowData);
              break;
          }
        } catch (error) {
          console.error(`${action} failed:`, error);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [onAction, api],
  );

  // Рендер ячейки по типу
  const renderCell = (cell, rowIndex, cellIndex) => {
    const { type, value, field, rowId, editable, options } = cell;
    const isEditable = editable && table.editable;

    switch (type) {
      case "label": {
        return (
          <div key={`cell-${cellIndex}`} className="table-cell">
            {value}
          </div>
        );
      }

      case "input": {
        return (
          <div key={`cell-${cellIndex}`} className="table-cell">
            {isEditable ? (
              <input
                type="text"
                value={value || ""}
                onChange={(e) => handleCellChange(rowId, field, e.target.value)}
                className="table-input"
              />
            ) : (
              <span className="table-text">{value}</span>
            )}
          </div>
        );
      }

      case "select": {
        return (
          <div key={`cell-${cellIndex}`} className="table-cell">
            {isEditable ? (
              <select
                value={value || ""}
                onChange={(e) => handleCellChange(rowId, field, e.target.value)}
                className="table-select"
              >
                {options?.map((opt, idx) => (
                  <option key={idx} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <span className="table-text">
                {options?.find((opt) => opt.value === value)?.label || value}
              </span>
            )}
          </div>
        );
      }

      case "image": {
        return (
          <div key={`cell-${cellIndex}`} className="table-cell">
            {value ? (
              <img src={value} alt="" className="table-image" />
            ) : (
              <span className="table-text">No image</span>
            )}
          </div>
        );
      }

      case "action": {
        const { actions = ["edit", "delete"] } = cell;
        return (
          <div key={`cell-${cellIndex}`} className="table-cell table-actions">
            {actions.includes("edit") && (
              <button
                onClick={() => handleAction("edit", rowId, cell.rowData)}
                className="action-btn edit-btn"
              >
                Edit
              </button>
            )}
            {actions.includes("delete") && (
              <button
                onClick={() => handleAction("delete", rowId)}
                className="action-btn delete-btn"
              >
                Delete
              </button>
            )}
            {actions.includes("save") && (
              <button
                onClick={() => handleAction("save", rowId, cell.rowData)}
                className="action-btn save-btn"
              >
                Save
              </button>
            )}
            {actions.includes("cancel") && (
              <button
                onClick={() => handleAction("cancel", rowId)}
                className="action-btn cancel-btn"
              >
                Cancel
              </button>
            )}
          </div>
        );
      }

      default:
        return (
          <div key={`cell-${cellIndex}`} className="table-cell">
            {String(value)}
          </div>
        );
    }
  };

  return (
    <div className="table">
      {isLoading && <div className="table-loading">Loading...</div>}

      <div className="table-header">
        <div className="table-header-row">
          {table.header.map((item, idx) => (
            <div key={`header-${idx}`} className="header-cell">
              {item}
            </div>
          ))}
          {table.draggable && (
            <div key="header-drag" className="header-cell drag-header">
              ↕
            </div>
          )}
        </div>
      </div>

      <div className="table-body">
        {table.body.map((row, rowIndex) => {
          const rowId = row.find((cell) => cell.rowId)?.rowId;

          return (
            <div
              key={`row-${rowIndex}`}
              className={`table-body-row ${draggingId === rowId ? "dragging" : ""} ${dragOverId === rowId ? "drag-over" : ""}`}
              draggable={table.draggable}
              onDragStart={(e) => table.draggable && handleDragStart(e, rowId)}
              onDragOver={(e) => table.draggable && handleDragOver(e, rowId)}
              onDragEnd={handleDragEnd}
              onDragLeave={() => setDragOverId(null)}
            >
              {row.map((cell, cellIndex) =>
                renderCell(cell, rowIndex, cellIndex),
              )}

              {table.draggable && (
                <div
                  key={`drag-${rowIndex}`}
                  className="table-cell drag-handle"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <span className="drag-icon" title="Drag to reorder">
                    ☰
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
