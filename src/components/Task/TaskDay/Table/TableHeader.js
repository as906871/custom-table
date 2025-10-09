import React, { useState, useRef, useEffect } from "react";
import { Trash2, Edit2, Plus, GripVertical } from "lucide-react";

const TableHeader = ({
  columns,
  onEditColumn,
  onDeleteColumn,
  onAddColumn,
  onReorderColumns,
}) => {
  const [columnWidths, setColumnWidths] = useState({});
  const [resizingColumn, setResizingColumn] = useState(null);

  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const getColumnWidth = (columnId) => {
    return columnWidths[columnId] || 240;
  };

  const handleMouseDown = (e, columnId) => {
    e.preventDefault();
    e.stopPropagation();

    setResizingColumn(columnId);
    startXRef.current = e.clientX;
    startWidthRef.current = getColumnWidth(columnId);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!resizingColumn) return;

      const diff = e.clientX - startXRef.current;
      const newWidth = Math.max(120, startWidthRef.current + diff);

      setColumnWidths((prev) => ({
        ...prev,
        [resizingColumn]: newWidth,
      }));
    };

    const handleMouseUp = () => {
      setResizingColumn(null);
    };

    if (resizingColumn) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "none";
      document.body.style.cursor = "col-resize";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [resizingColumn]);

  const [draggedColumn, setDraggedColumn] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const handleDragStart = (e, columnId) => {
    setDraggedColumn(columnId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    if (draggedColumn && draggedColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    if (draggedColumn && draggedColumn !== targetColumnId) {
      const fromIndex = columns.findIndex((col) => col.id === draggedColumn);
      const toIndex = columns.findIndex((col) => col.id === targetColumnId);
      onReorderColumns(fromIndex, toIndex);
    }
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  return (
    <thead className="bg-gray-50 sticky top-0 z-10">
      <tr>
        {columns.map((column, idx) => (
          <th
            key={column.id}
            draggable
            onDragStart={(e) => handleDragStart(e, column.id)}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDrop={(e) => handleDrop(e, column.id)}
            onDragEnd={handleDragEnd}
            className={`relative px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase border-r border-gray-200 transition-all ${
              draggedColumn === column.id ? "opacity-50" : ""
            } ${dragOverColumn === column.id ? "bg-blue-100" : ""}`}
            // className="relative px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase border-r border-gray-200"
            style={{
              width: `${getColumnWidth(column.id)}px`,
              minWidth: `${getColumnWidth(column.id)}px`,
              maxWidth: `${getColumnWidth(column.id)}px`,
              cursor: "move",
            }}
          >
            <div className="flex items-center justify-between gap-1 sm:gap-2">
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <GripVertical
                  size={14}
                  className="text-gray-400 flex-shrink-0 sm:w-3.5 sm:h-3.5"
                />
                <div className="truncate text-xs sm:text-xs">{column.name}</div>
              </div>

              <div className="flex gap-0.5 sm:gap-1 flex-shrink-0 items-center">
                {idx === 0 && (
                  <button
                    onClick={onAddColumn}
                    className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                    title="Add column"
                  >
                    <Plus size={12} className="sm:w-3.5 sm:h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => onEditColumn(column)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  title="Edit column"
                >
                  <Edit2 size={14} className="sm:w-3.5 sm:h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteColumn(column.id)}
                  className="p-1 hover:bg-red-100 text-red-600 rounded transition-colors"
                  title="Delete column"
                >
                  <Trash2 size={14} className="sm:w-3.5 sm:h-3.5" />
                </button>

                {/* {idx === columns.length - 1 && (
                  <button
                    onClick={onAddColumn}
                    className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-md hover:shadow-lg mr-1"
                    title="Add column"
                  >
                    <Plus size={12} className="sm:w-3.5 sm:h-3.5" />
                  </button>
                )} */}
              </div>
            </div>

            <div
              className={`absolute top-0 right-0 w-1 h-full cursor-col-resize group z-10 ${
                resizingColumn === column.id ? "bg-blue-500" : ""
              }`}
              onMouseDown={(e) => handleMouseDown(e, column.id)}
            >
              <div className="w-3 h-full -ml-1 group-hover:bg-blue-400 transition-colors" />
            </div>
          </th>
        ))}

        <th className="sticky right-[4rem] sm:right-[6rem] md:right-[7rem] lg:right-[6rem] z-30 bg-gray-50 px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase w-20 border-l border-gray-200 shadow-sm">
          No.
        </th>
        <th className="sticky right-0 z-30 bg-gray-50 px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase w-24 border-l border-gray-200 shadow-sm">
          Actions
        </th>
      </tr>
    </thead>
  );
};

export default TableHeader;
