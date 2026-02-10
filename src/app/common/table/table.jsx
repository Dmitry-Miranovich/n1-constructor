import { useBannerAPI } from "../../_utils/hooks/useBannerAPI";
import "./table.scss";
import Input from "../input";
import Select from "../select";
import { bannerTableIcons } from "../../admin/_components/banner-panel/banner-panel.data";
import { SettingsMode } from "src/app/_utils/enums/settings";
/**
 * @typedef {Object} TableCellData
 * @property {string} type - Тип ячейки ('text', 'image', 'select', 'color', etc.)
 * @property {string} propertyName - Ключ к объекту
 * @property {*} values - Значение ячейки (зависит от type)
 * @property {*} [options] - (Опциональный) Для select значений
 */

/**
 * @typedef {Object} TableConfig
 * @property {string[]} header
 * @property {TableCellData[][]} body
 */

/**
 * @typedef {Object} TableProps
 * @property {TableConfig} table
 * @property {string} entityType
 * @property {string} entityApiName
 * @property {string} title
 * @property {*} addEntity
 * @property {React.ReactNode} [options]
 * @property {{edit: boolean, delete: boolean}} [actionsAccessibility]
 */

/**
 * @param {TableProps} props
 */
export default function Table({
  entityType,
  table,
  entityApiName,
  title,
  addEntity,
  options,
  actionsAccessibility = {
    edit: true,
    delete: true,
  },
}) {
  const {
    handleAdd,
    handleCancel,
    handleDelete,
    handleEdit,
    handleSave,
    handleMoveDown,
    handleMoveUp,
    handleOnChange,
    isEdit,
    handleCopy,
    entity,
    getEditMode,
    copySettings,
  } = useBannerAPI(entityType, entityApiName);

  const editMode = getEditMode(entityType);

  return (
    <div className="table-main">
      {options ? (
        options
      ) : (
        <div className="table-main-options">
          <p className="table-main-options-title">{title}</p>
          {editMode.mode !== SettingsMode.COPY ? (
            <div className="table-main-options-controller">
              <button
                className="table-main-options-button add"
                onClick={() => handleAdd(addEntity)}
              >
                Add
              </button>
              <button
                className="table-main-options-button copy"
                onClick={() => handleCopy()}
              >
                Copy
              </button>
            </div>
          ) : (
            <div className="table-main-options-controller">
              <button
                className="table-main-options-button add"
                onClick={() => copySettings.handleConfirm()}
              >
                Confirm
              </button>
              <button
                className="table-main-options-button delete"
                onClick={() => copySettings.handleRemoveAll()}
              >
                Delete
              </button>
              <button
                className="table-main-options-button cancel"
                onClick={() => copySettings.handleCancel()}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
      <div className="table-main-context">
        {entity && entity.length > 0 && (
          <table className="table-main-table">
            <thead className="table-main-table-header">
              <tr className="table-main-table-header-row">
                {editMode.mode === SettingsMode.COPY && (
                  <th className="table-main-table-header-row-item checkbox-item"></th>
                )}
                <th className="table-main-table-header-row-item">ID</th>
                {table.header.map((item, key) => (
                  <th
                    className="table-main-table-header-row-item"
                    key={`banner-header-item-${key}`}
                  >
                    {item}
                  </th>
                ))}
                {editMode.mode !== SettingsMode.COPY && (
                  <>
                    <th className="table-main-table-header-row-item">
                      Actions
                    </th>
                    <th className="table-main-table-header-row-item order-header">
                      Order
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="table-main-table-body">
              {table.body.map((row, rowIndex) => (
                <tr
                  className="table-main-table-body-row"
                  key={`row-${rowIndex}`}
                >
                  {editMode.mode === SettingsMode.COPY && (
                    <td className="table-main-table-body-row-item checkbox-item">
                      <input
                        type="checkbox"
                        value={"rowIndex"}
                        onChange={(e) =>
                          copySettings.handleCheckboxSelect(
                            rowIndex,
                            e.target.checked,
                          )
                        }
                      />
                    </td>
                  )}
                  <td className="table-main-table-body-row-item">
                    {rowIndex + 1}
                  </td>
                  {row.map((cell, index) => {
                    if (cell.propertyName !== "id") {
                      switch (cell.type) {
                        case "input": {
                          return (
                            <td
                              className="table-main-table-body-row-item"
                              key={`cell-${index}`}
                            >
                              <Input
                                value={entity[rowIndex][cell.propertyName]}
                                onChange={(value) =>
                                  handleOnChange(
                                    value,
                                    cell.propertyName,
                                    rowIndex,
                                  )
                                }
                                readOnly={!isEdit(entity[rowIndex].id)}
                                className="table-input-name"
                              />
                            </td>
                          );
                        }
                        case "select": {
                          return (
                            <td
                              className="table-main-table-body-row-item"
                              key={`cell-${index}`}
                            >
                              <Select
                                value={entity[rowIndex][cell.propertyName]}
                                readOnly={!isEdit(entity[rowIndex].id)}
                                options={cell.options ?? []}
                                onChange={(value) => {
                                  handleOnChange(
                                    value,
                                    cell.propertyName,
                                    rowIndex,
                                  );
                                }}
                              />
                            </td>
                          );
                        }
                        case "label": {
                          return (
                            <td
                              className="table-main-table-body-row-item"
                              key={`cell-${index}`}
                            >
                              <p>{cell.values}</p>
                            </td>
                          );
                        }
                        default: {
                          return (
                            <td
                              className="table-main-table-body-row-item"
                              key={`cell-${index}`}
                            >
                              <p>{cell.values}</p>
                            </td>
                          );
                        }
                      }
                    }
                  })}
                  {editMode.mode !== SettingsMode.COPY && (
                    <>
                      <td className="table-main-table-body-row-item">
                        <div className="table-main-table-body-row-item-actions">
                          {isEdit(entity[rowIndex].id) ? (
                            <>
                              <button
                                onClick={() =>
                                  handleSave(entity[rowIndex].id, rowIndex)
                                }
                                className="table-main-table-body-row-item-actions-item"
                              >
                                <img src={bannerTableIcons.check} alt="Save" />
                              </button>
                              <button
                                onClick={handleCancel}
                                className="table-main-table-body-row-item-actions-item"
                              >
                                <img
                                  src={bannerTableIcons.clear}
                                  alt="Cancel"
                                />
                              </button>
                            </>
                          ) : (
                            <>
                              {actionsAccessibility.edit && (
                                <button
                                  onClick={() => {
                                    if (editMode.mode !== SettingsMode.EDIT) {
                                      handleEdit(entity[rowIndex].id);
                                    }
                                  }}
                                  className="table-main-table-body-row-item-actions-item"
                                >
                                  <img src={bannerTableIcons.edit} alt="Edit" />
                                </button>
                              )}
                              {actionsAccessibility.delete && (
                                <button
                                  onClick={() => {
                                    if (editMode.mode !== SettingsMode.EDIT) {
                                      handleDelete(entity[rowIndex].id);
                                    }
                                  }}
                                  className="table-main-table-body-row-item-actions-item"
                                >
                                  <img
                                    src={bannerTableIcons.remove}
                                    alt="Remove"
                                  />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                      <td className="table-main-table-body-row-item order-header">
                        <button
                          onClick={() => {
                            if (editMode.mode !== SettingsMode.EDIT) {
                              handleMoveUp(rowIndex);
                            }
                          }}
                          disabled={rowIndex === 0}
                          className="table-main-table-body-row-item-actions-item move-btn"
                          title="Move up"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => {
                            if (editMode.mode !== SettingsMode.EDIT) {
                              handleMoveDown(rowIndex);
                            }
                          }}
                          disabled={rowIndex === entity.length - 1}
                          className="table-main-table-body-row-item-actions-item move-btn"
                          title="Move down"
                        >
                          ↓
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
