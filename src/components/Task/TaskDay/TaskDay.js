import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plus } from "lucide-react";
import EmptyState from "../TaskDay/Table/EmptyState";
import ColumnModal from "../TaskDay/Table/ColumnModal";
import TableRow from "../TaskDay/Table/TableRow";
import TableHeader from "../TaskDay/Table/TableHeader";
import {
  addColumn,
  updateColumn,
  deleteColumn,
  addRow,
  updateCell,
  deleteRow,
   reorderColumns,  // ADD THIS
  reorderRows, 
} from "../../../redux/reducer/tableReducer/TableReducer";
import DeleteModal from "../../Common/DeleteModal";

const Task = () => {
  const dispatch = useDispatch();
  const { columns, rows } = useSelector((state) => state.table);

  const [showColumnModal, setShowColumnModal] = useState(false);
  const [editingColumn, setEditingColumn] = useState(null);
  const [columnForm, setColumnForm] = useState({
    name: "",
    type: "text",
    options: [],
  });
  const [optionInput, setOptionInput] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleAddColumn = () => {
    setColumnForm({ name: "", type: "text", options: [] });
    setEditingColumn(null);
    setShowColumnModal(true);
  };

  const handleEditColumn = (column) => {
    setColumnForm({
      name: column.name,
      type: column.type,
      options: column.options || [],
    });
    setEditingColumn(column.id);
    setShowColumnModal(true);
  };

  const handleSaveColumn = () => {
    if (!columnForm.name.trim()) return;

    if (editingColumn) {
      dispatch(updateColumn({ id: editingColumn, ...columnForm }));
    } else {
      dispatch(addColumn(columnForm));
    }

    setShowColumnModal(false);
    setColumnForm({ name: "", type: "text", options: [] });
    setOptionInput("");
  };

  const handleAddRow = () => {
    dispatch(addRow());
  };

  const handleDeleteColumn = (columnId) => {
    setDeleteTarget({ type: "column", id: columnId });
    setShowDeleteModal(true);
  };

  const handleDeleteRow = (rowId) => {
    setDeleteTarget({ type: "row", id: rowId });
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      if (deleteTarget.type === "column") {
        dispatch(deleteColumn(deleteTarget.id));
      } else if (deleteTarget.type === "row") {
        dispatch(deleteRow(deleteTarget.id));
      }
    }
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const handleCellChange = (rowId, columnId, value) => {
    dispatch(updateCell({ rowId, columnId, value }));
  };


    const handleReorderColumns = (fromIndex, toIndex) => {
    dispatch(reorderColumns({ fromIndex, toIndex }));
  };

  const handleReorderRows = (draggedRowId, targetRowId) => {
    dispatch(reorderRows({ draggedRowId, targetRowId }));
  };

  return (
    <div className="w-full h-full flex flex-col">

      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Table</h2>
          <div className="flex gap-2">
            {columns.length === 0 && (
              <button
                onClick={handleAddColumn}
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors flex-1 sm:flex-initial"
              >
                <Plus size={18} className="sm:w-5 sm:h-5" />
                <span className="whitespace-nowrap">Add Column</span>
              </button>
            )}
            {rows.length === 0 && (
              <button
                onClick={handleAddRow}
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white text-sm sm:text-base rounded-lg hover:bg-green-700 transition-colors flex-1 sm:flex-initial"
              >
                <Plus size={18} className="sm:w-5 sm:h-5" />
                <span className="whitespace-nowrap">Add Row</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {columns.length === 0 ? (
          <div className="p-3 sm:p-4 lg:p-6">
            <EmptyState type="columns" onAction={handleAddColumn} />
          </div>
        ) : (
          <div className="min-w-full inline-block align-middle">
            <div className="bg-white shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <TableHeader
                  columns={columns}
                  onEditColumn={handleEditColumn}
                  onDeleteColumn={handleDeleteColumn}
                  onAddColumn={handleAddColumn}
                  onReorderColumns={handleReorderColumns}
                />
                <tbody className="bg-white divide-y divide-gray-200">
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 2} className="p-4">
                        <EmptyState type="rows" />
                      </td>
                    </tr>
                  ) : (
                    rows.map((row, index) => (
                      <TableRow
                        key={row.id}
                        row={row}
                        index={index}
                        columns={columns}
                        onCellChange={handleCellChange}
                        onDeleteRow={handleDeleteRow}
                        isLastRow={index === rows.length - 1}
                        onAddRow={handleAddRow}
                        onReorderRows={handleReorderRows}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <ColumnModal
        isOpen={showColumnModal}
        editingColumn={editingColumn}
        columnForm={columnForm}
        setColumnForm={setColumnForm}
        optionInput={optionInput}
        setOptionInput={setOptionInput}
        onSave={handleSaveColumn}
        onClose={() => setShowColumnModal(false)}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete this ${
          deleteTarget?.type === "column" ? "column" : "row"
        }? This action cannot be undone.`}
      />
    </div>
  );
};

export default Task;