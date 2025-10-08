import React from "react";

const EmptyState = ({ type, onAction }) => {
  if (type === "columns") {
    return (
      <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500 mb-4">
          No columns yet. Add your first column to get started!
        </p>
        <button
          onClick={onAction}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Column
        </button>
      </div>
    );
  }

  if (type === "rows") {
    return (
      <tr>
        <td colSpan="100%" className="px-4 py-8 text-center text-gray-500">
          No rows yet. Click "Add Row" to add data.
        </td>
      </tr>
    );
  }

  return null;
};

export default EmptyState;
