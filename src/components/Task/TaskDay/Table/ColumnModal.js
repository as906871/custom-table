import React from "react";
import { Plus, X, Check } from "lucide-react";
import { COLUMN_TYPES } from "../../../../utils/constant";

const ColumnModal = ({
  isOpen,
  editingColumn,
  columnForm,
  setColumnForm,
  optionInput,
  setOptionInput,
  onSave,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleAddOption = () => {
    if (optionInput.trim()) {
      setColumnForm({
        ...columnForm,
        options: [...columnForm.options, optionInput.trim()],
      });
      setOptionInput("");
    }
  };

  const handleRemoveOption = (index) => {
    setColumnForm({
      ...columnForm,
      options: columnForm.options.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            {editingColumn ? "Edit Column" : "Add Column"}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Column Name
            </label>
            <input
              type="text"
              dir="rtl"
              value={columnForm.name}
              onChange={(e) =>
                setColumnForm({ ...columnForm, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter column name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Column Type
            </label>
            <select
              value={columnForm.type}
              onChange={(e) =>
                setColumnForm({
                  ...columnForm,
                  type: e.target.value,
                  options: [],
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {COLUMN_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {(columnForm.type === "single-select" ||
            columnForm.type === "multi-select") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={optionInput}
                  onChange={(e) => setOptionInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddOption()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter option"
                />
                <button
                  onClick={handleAddOption}
                  className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {columnForm.options.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded"
                  >
                    <span className="text-sm">{option}</span>
                    <button
                      onClick={() => handleRemoveOption(index)}
                      className="p-1 hover:bg-red-100 text-red-600 rounded"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <Check size={20} />
            {editingColumn ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ColumnModal;
