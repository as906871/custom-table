import React, { useState } from "react";
import { X, Upload } from "lucide-react";
import MultiSelectCell from "./MultiSelect";

const TableCell = ({ row, column, onCellChange }) => {
  const cellValue = row.data[column.id] || "";
  // const [showImagePreview, setShowImagePreview] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(null);
  const [showAllFiles, setShowAllFiles] = useState(false);
  const [hoveredImage, setHoveredImage] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleChange = (value) => {
    onCellChange(row.id, column.id, value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newFile = {
          name: file.name,
          type: file.type,
          preview: reader.result,
        };

        console.log("Current cellValue:", cellValue);

        let currentFiles = [];
        if (Array.isArray(cellValue)) {
          currentFiles = [...cellValue];
        } else if (
          cellValue &&
          typeof cellValue === "object" &&
          cellValue.name
        ) {
          currentFiles = [cellValue];
          console.log("Cell value is single object, converting to array");
        } else if (cellValue && cellValue !== "") {
          console.log("Cell value is something else:", cellValue);
        }

        const newFiles = [...currentFiles, newFile];
        // console.log("Setting new files array with length:", newFiles.length);
        handleChange(newFiles);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const removeFile = () => {
    handleChange("");
  };

  const renderFileCell = () => {
    const files = Array.isArray(cellValue)
      ? cellValue
      : cellValue
      ? [cellValue]
      : [];
    const displayFiles = files.slice(0, 2);
    const remainingCount = files.length > 2 ? files.length - 2 : 0;

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2 items-center">
          {displayFiles.map((file, index) => {
            const isImage = file?.type?.startsWith("image/");
            return (
              <div key={index}>
                {isImage && file.preview ? (
                  <img
                    src={file.preview}
                    alt=""
                    className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-full border-2 border-gray-300 cursor-pointer hover:border-blue-500 transition-all"
                    onClick={() => setShowImagePreview(file.preview)}
                    onMouseEnter={(e) => {
                      setHoveredImage(file.preview);
                      handleMouseMove(e);
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setHoveredImage(null)}
                  />
                ) : (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-300 text-gray-600 text-xs rounded-full border-2 border-gray-300 font-semibold">
                    {file.name?.split(".").pop()?.toUpperCase().slice(0, 3) ||
                      "FILE"}
                  </div>
                )}
                <button
                  onClick={() => {
                    const newFiles = files.filter((_, i) => i !== index);
                    handleChange(newFiles.length > 0 ? newFiles : "");
                  }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600 z-10"
                  title="Remove file"
                  type="button"
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}

          {remainingCount > 0 && (
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-blue-500 text-white text-xs sm:text-sm rounded-full border-2 border-blue-400 font-bold cursor-pointer hover:bg-blue-600 transition-all"
              title={`${remainingCount} more file${
                remainingCount > 1 ? "s" : ""
              }`}
              onClick={() => setShowAllFiles(true)}
            >
              +{remainingCount}
            </div>
          )}

          <label className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors flex-shrink-0">
            <Upload size={16} className="text-gray-500" />
            <input type="file" onChange={handleFileChange} className="hidden" />
          </label>
        </div>

        {hoveredImage && (
          <div
            className="fixed z-[100] pointer-events-none"
            style={{
              left: `${mousePosition.x + 20}px`,
              top: `${mousePosition.y + 20}px`,
            }}
          >
            <img
              src={hoveredImage}
              alt="Preview"
              className="w-48 h-48 object-cover rounded-lg shadow-2xl border-4 border-white"
            />
          </div>
        )}

        {showImagePreview && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setShowImagePreview(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh]">
              <button
                onClick={() => setShowImagePreview(null)}
                className="absolute -top-10 right-0 sm:-top-12 p-2 bg-white rounded-full hover:bg-gray-100"
                type="button"
              >
                <X size={20} />
              </button>
              <img
                src={showImagePreview}
                alt=""
                className="max-w-full max-h-[85vh] object-contain rounded"
              />
            </div>
          </div>
        )}

        {showAllFiles && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAllFiles(false)}
          >
            <div
              className="bg-white rounded-lg p-6 max-w-2xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  All Files ({files.length})
                </h3>
                <button
                  onClick={() => setShowAllFiles(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  type="button"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {files.map((file, index) => {
                  const isImage = file?.type?.startsWith("image/");
                  return (
                    <div key={index} className="relative group">
                      {isImage && file.preview ? (
                        <img
                          src={file.preview}
                          alt=""
                          className="w-full h-24 object-cover rounded-lg border-2 border-gray-300 cursor-pointer hover:border-blue-500 transition-all"
                          onClick={() => {
                            setShowAllFiles(false);
                            setShowImagePreview(file.preview);
                          }}
                        />
                      ) : (
                        <div className="w-full h-24 flex flex-col items-center justify-center bg-gray-200 text-gray-600 text-xs rounded-lg border-2 border-gray-300 font-semibold">
                          <span>
                            {file.name
                              ?.split(".")
                              .pop()
                              ?.toUpperCase()
                              .slice(0, 3) || "FILE"}
                          </span>
                          <span className="text-[10px] mt-1 px-2 truncate w-full text-center">
                            {file.name}
                          </span>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          const newFiles = files.filter((_, i) => i !== index);
                          handleChange(newFiles.length > 0 ? newFiles : "");
                          if (newFiles.length <= 2) {
                            setShowAllFiles(false);
                          }
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600 shadow-lg"
                        title="Remove file"
                        type="button"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
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
