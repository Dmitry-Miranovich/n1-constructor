import { useBannerAPI } from "../../_utils/hooks/useBannerAPI";
import "./table.scss";
import Input from "../input";
import Select from "../select";
import { bannerTableIcons } from "../../admin/_components/banner-panel/banner-panel.data";
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
    entity,
  } = useBannerAPI(entityType, entityApiName);
  return (
    <div className="table-main">
      <div className="table-main-options">
        <p className="table-main-options-title">{title}</p>
        <button
          className="table-main-options-button add"
          onClick={() => handleAdd(addEntity)}
        >
          Add
        </button>
      </div>
      {entity && entity.length > 0 && (
        <table className="table-main-table">
          <thead className="table-main-table-header">
            <tr className="table-main-table-header-row">
              {table.header.map((item, key) => (
                <th
                  className="table-main-table-header-row-item"
                  key={`banner-header-item-${key}`}
                >
                  {item}
                </th>
              ))}
              <th className="table-main-table-header-row-item order-header">
                Order
              </th>
            </tr>
          </thead>
          <tbody className="table-main-table-body">
            {table.body.map((row, rowIndex) => (
              <tr className="table-main-table-body-row" key={`row-${rowIndex}`}>
                {row.map((cell, index) => {
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
                              handleOnChange(value, cell.propertyName, rowIndex)
                            }
                            readOnly={!isEdit(rowIndex)}
                            className="table-input-name"
                          />
                        </td>
                      );
                    }
                    case "select": {
                      console.log(cell);
                      return (
                        <td
                          className="table-main-table-body-row-item"
                          key={`cell-${index}`}
                        >
                          <Select
                            value={entity[rowIndex][cell.propertyName]}
                            readOnly={!isEdit(rowIndex)}
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
                })}
                <td className="table-main-table-body-row-item">
                  <div className="table-main-table-body-row-item-actions">
                    {isEdit(rowIndex) ? (
                      <>
                        <button
                          onClick={() => handleSave(rowIndex)}
                          className="table-main-table-body-row-item-actions-item"
                        >
                          <img src={bannerTableIcons.check} alt="Save" />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="table-main-table-body-row-item-actions-item"
                        >
                          <img src={bannerTableIcons.clear} alt="Cancel" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(rowIndex)}
                          className="table-main-table-body-row-item-actions-item"
                        >
                          <img src={bannerTableIcons.edit} alt="Edit" />
                        </button>
                        <button
                          onClick={() => handleDelete(rowIndex)}
                          className="table-main-table-body-row-item-actions-item"
                        >
                          <img src={bannerTableIcons.remove} alt="Remove" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
                <td className="table-main-table-body-row-item">
                  <button
                    onClick={() => handleMoveUp(rowIndex)}
                    disabled={rowIndex === 0}
                    className="table-main-table-body-row-item-actions-item move-btn"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handleMoveDown(rowIndex)}
                    disabled={rowIndex === entity.length - 1}
                    className="table-main-table-body-row-item-actions-item move-btn"
                    title="Move down"
                  >
                    ↓
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
