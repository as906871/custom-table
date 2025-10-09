import React, { useState } from "react";
import { Trash2, Plus, GripVertical } from "lucide-react";
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
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  console.log("row", row?.id);
  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", row?.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const draggedRowId = e.dataTransfer.getData("text/plain");
    if (draggedRowId && draggedRowId !== row.id) {
      onReorderRows(draggedRowId, row.id);
    }
    setIsDragOver(false);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

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
      } ${isDragOver ? "bg-blue-50 border-blue-300" : ""}`}
    >
      {columns.map((column) => (
        <td
          key={column.id}
          className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 border-r border-gray-200"
        >
          <TableCell row={row} column={column} onCellChange={onCellChange} />
        </td>
      ))}

      <td className="sticky right-[5rem] sm:right-[6rem] md:right-[7rem] lg:right-[6rem]  z-0 bg-white hover:bg-gray-50 px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 font-medium border-r border-gray-200 shadow-sm">
        <div className="flex items-center gap-1">
          <span>{row?.id?.replace(/^row_/, "")}</span>
          <GripVertical
            size={14}
            className="text-gray-400 cursor-move flex-shrink-0 sm:w-3.5 sm:h-3.5"
          />
        </div>
      </td>

      <td className="sticky right-0 z-0 bg-white hover:bg-gray-50 px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-center border-l border-gray-200 shadow-sm">
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
    </tr>
  );
};

export default TableRow;