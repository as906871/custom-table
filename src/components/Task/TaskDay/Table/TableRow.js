import React, { useState } from "react";
import { Trash2, Plus, GripVertical, CheckSquare, Square } from "lucide-react";
import TableCell from "./TableCell";

const TableRow = ({
  row,
  index,
  columns,
  onCellChange,
  onDeleteRow,
  isLastRow,
  onAddRow,
  onReorderRows,
  sidebarOnRight,
  onDragStart,
  onDragEnd,
  isSelected,
  onSelectRow,
  isDragging,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", row?.id);
    onDragStart(row?.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    onReorderRows(row?.id);
    setIsDragOver(false);
  };

  const handleDragEnd = () => {
    onDragEnd();
  };

  const displayColumns = sidebarOnRight ? [...columns].reverse() : columns;

  return (
    <tr
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
        isDragging ? "opacity-50" : ""
      } ${isDragOver ? "bg-blue-50 border-blue-300" : ""} 
      ${isSelected ? "bg-blue-50" : ""}`}
    >
      {sidebarOnRight && (
        <>
          <td className="sticky left-0 z-0 bg-white hover:bg-gray-50 px-3 py-2 text-center border-r border-gray-200 shadow-sm">
            <button
              onClick={() => onSelectRow(row?.id)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title={isSelected ? "Deselect row" : "Select row"}
            >
              {isSelected ? (
                <CheckSquare size={18} className="text-blue-600" />
              ) : (
                <Square size={18} className="text-gray-400" />
              )}
            </button>
          </td>

          <td className="sticky left-10 z-0 bg-white hover:bg-gray-50 px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-center border-r border-gray-200 shadow-sm">
            <div className="flex items-center justify-center gap-2">
              {isLastRow && (
                <button
                  onClick={onAddRow}
                  className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center bg-green-600 text-white rounded-full hover:bg-green-700 transition-all shadow-sm hover:shadow-md flex-shrink-0"
                  title="Add row"
                >
                  <Plus size={12} className="sm:w-3.5 sm:h-3.5" />
                </button>
              )}

              <button
                onClick={() => onDeleteRow(row.id)}
                className="p-1.5 sm:p-2 hover:bg-red-100 text-red-600 rounded transition-colors inline-flex items-center justify-center"
                title="Delete row"
              >
                <Trash2 size={14} className="sm:w-4 sm:h-4" />
              </button>
            </div>
          </td>

          <td className="sticky left-[8rem] z-0 bg-white hover:bg-gray-50 px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 font-medium border-r border-gray-200 shadow-sm">
            <div className="flex items-center gap-1 justify-center">
              <GripVertical
                size={14}
                className="text-gray-400 cursor-move flex-shrink-0 sm:w-3.5 sm:h-3.5"
              />
              <span>{row?.id?.replace(/^row_/, "")}</span>
            </div>
          </td>
        </>
      )}
      {/* {columns.map((column) => ( */}
      {displayColumns.map((column) => (
        <td
          key={column.id}
          className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 border-r border-gray-200"
        >
          <TableCell row={row} column={column} onCellChange={onCellChange} />
        </td>
      ))}

      {!sidebarOnRight && (
        <>
          <td className="sticky right-[8rem] z-0 bg-white hover:bg-gray-50 px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 font-medium border-r border-gray-200 shadow-sm">
            <div className="flex items-center gap-1">
              <span>{row?.id?.replace(/^row_/, "")}</span>
              <GripVertical
                size={14}
                className="text-gray-400 cursor-move flex-shrink-0 sm:w-3.5 sm:h-3.5"
              />
            </div>
          </td>

          <td className="sticky right-10 z-0 bg-white hover:bg-gray-50 px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-center border-l border-gray-200 shadow-sm">
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => onDeleteRow(row.id)}
                className="p-1.5 sm:p-2 hover:bg-red-100 text-red-600 rounded transition-colors inline-flex items-center justify-center"
                title="Delete row"
              >
                <Trash2 size={14} className="sm:w-4 sm:h-4" />
              </button>

              {isLastRow && (
                <button
                  onClick={onAddRow}
                  className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center bg-green-600 text-white rounded-full hover:bg-green-700 transition-all shadow-sm hover:shadow-md flex-shrink-0"
                  title="Add row"
                >
                  <Plus size={12} className="sm:w-3.5 sm:h-3.5" />
                </button>
              )}
            </div>
          </td>

          <td className="sticky right-0 z-20 bg-white hover:bg-gray-50 px-3 py-2 text-center border-l border-gray-200 shadow-sm">
            <button
              onClick={() => onSelectRow(row?.id)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title={isSelected ? "Deselect row" : "Select row"}
            >
              {isSelected ? (
                <CheckSquare size={18} className="text-blue-600" />
              ) : (
                <Square size={18} className="text-gray-400" />
              )}
            </button>
          </td>
        </>
      )}
    </tr>
  );
};

export default TableRow;
