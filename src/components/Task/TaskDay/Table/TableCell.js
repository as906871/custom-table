import React, { useState } from "react";
import { X, Upload } from "lucide-react";
import MultiSelectCell from "./MultiSelect";

const TableCell = ({ row, column, onCellChange }) => {
  const cellValue = row.data[column.id] || "";
  const [showImagePreview, setShowImagePreview] = useState(false);

  const handleChange = (value) => {
    onCellChange(row.id, column.id, value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange({
          name: file.name,
          type: file.type,
          preview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    handleChange("");
  };

  const renderFileCell = () => {
    const isImage = cellValue?.type?.startsWith("image/");
    const hasFile =
      cellValue && (typeof cellValue === "object" ? cellValue.name : cellValue);

    return (
      <div className="space-y-2">
        {!hasFile ? (
          <label className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <Upload size={14} className="text-gray-500 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm text-gray-600">Upload</span>
            <input type="file" onChange={handleFileChange} className="hidden" />
          </label>
        ) : (
          <div className="flex items-center gap-1 sm:gap-2 border border-gray-200 rounded-md p-1">
            {isImage && cellValue.preview ? (
              <img
                src={cellValue.preview}
                alt={cellValue.name}
                className="w-12 h-10 sm:w-16 sm:h-12 object-cover rounded border border-gray-200 cursor-pointer flex-shrink-0"
                onClick={() => setShowImagePreview(true)}
              />
            ) : (
              <div className="w-12 h-10 sm:w-16 sm:h-12 flex items-center justify-center bg-gray-200 text-gray-500 text-xs rounded flex-shrink-0">
                File
              </div>
            )}

            <span className="text-xs sm:text-sm text-gray-700 flex-1 truncate min-w-0">
              {typeof cellValue === "object"
                ? cellValue.name.length > 12
                  ? cellValue.name.slice(0, 12) + "..."
                  : cellValue.name
                : cellValue}
            </span>

            <button
              onClick={removeFile}
              className="p-1 hover:bg-red-100 text-red-600 rounded flex-shrink-0"
              title="Remove file"
              type="button"
            >
              <X size={14} className="sm:w-4 sm:h-4" />
            </button>
          </div>
        )}

        {isImage && showImagePreview && cellValue.preview && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setShowImagePreview(false)}
          >
            <div className="relative max-w-4xl max-h-[90vh]">
              <button
                onClick={() => setShowImagePreview(false)}
                className="absolute -top-10 right-0 sm:-top-12 p-2 bg-white rounded-full hover:bg-gray-100"
                type="button"
              >
                <X size={20} />
              </button>
              <img
                src={cellValue.preview}
                alt={cellValue.name}
                className="max-w-full max-h-[85vh] object-contain rounded"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  const inputClassName =
    "w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";

  const getContrastColor = (bgColor) => {
    if (!bgColor) return "#000000";
    const color = bgColor.replace("#", "");
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "#000000" : "#FFFFFF";
  };

  switch (column.type) {
    case "text":
      if (typeof cellValue === "object" && cellValue !== null) {
        if (cellValue.users) {
          return (
            <div className="flex flex-wrap gap-1">
              {cellValue.users.map((user, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {user.user}
                </span>
              ))}
            </div>
          );
        } else if (cellValue.color) {
          return (
            <div
              className="inline-flex items-center px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium"
              style={{
                backgroundColor: cellValue.color,
                color: getContrastColor(cellValue.color),
              }}
            >
              {cellValue.text}
            </div>
          );
        }
        return (
          <span className="text-xs sm:text-sm">{cellValue.text || ""}</span>
        );
      }
      return (
        <input
          type="text"
          dir="rtl"
          value={cellValue}
          onChange={(e) => handleChange(e.target.value)}
          className={inputClassName}
          placeholder="Enter text"
        />
      );

    case "number":
      return (
        <input
          type="number"
          dir="rtl"
          value={cellValue}
          onChange={(e) => handleChange(e.target.value)}
          className={inputClassName}
          placeholder="Enter number"
        />
      );

    case "date":
      return (
        <input
          type="date"
          value={cellValue}
          onChange={(e) => handleChange(e.target.value)}
          className={inputClassName}
        />
      );

    case "file":
      return renderFileCell();

    case "single-select":
      const displayValue =
        typeof cellValue === "object" && cellValue !== null
          ? cellValue.text
          : cellValue;
      const cellColor =
        typeof cellValue === "object" && cellValue !== null
          ? cellValue.color
          : null;

      return (
        <div>
          <select
            value={displayValue || ""}
            onChange={(e) => {
              const selectedOption = column.options?.find(
                (opt) =>
                  (typeof opt === "object" ? opt.text : opt) === e.target.value
              );
              handleChange(selectedOption || e.target.value);
            }}
            className={inputClassName}
            style={
              cellColor
                ? {
                    backgroundColor: cellColor,
                    color: getContrastColor(cellColor),
                    fontWeight: "500",
                  }
                : {}
            }
          >
            <option value="">Select option</option>
            {column.options?.map((option, idx) => {
              const optText = typeof option === "object" ? option.text : option;
              const optColor = typeof option === "object" ? option.color : null;
              return (
                <option
                  key={idx}
                  value={optText}
                  style={
                    optColor
                      ? {
                          backgroundColor: optColor,
                          color: getContrastColor(optColor),
                        }
                      : {}
                  }
                >
                  {optText}
                </option>
              );
            })}
          </select>
        </div>
      );

    case "multi-select":
      return (
        <MultiSelectCell
          value={cellValue}
          options={column.options}
          onChange={handleChange}
        />
      );

    default:
      return null;
  }
};

export default TableCell;
