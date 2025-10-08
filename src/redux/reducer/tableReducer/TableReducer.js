import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../resetReducer/ResetReducer";

const initialState = {
  columns: [],
  rows: [],
};

const tableSlice = createSlice({
  name: "table",
  initialState,
  extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
  reducers: {
    addColumn: (state, action) => {
      const newColumn = {
        id: `col_${Date.now()}`,
        name: action.payload.name,
        type: action.payload.type,
        options: action.payload.options || [],
      };
      state.columns.push(newColumn);
    },

    updateColumn: (state, action) => {
      const { id, name, type, options } = action.payload;
      const columnIndex = state.columns.findIndex((col) => col.id === id);
      if (columnIndex !== -1) {
        state.columns[columnIndex] = {
          ...state.columns[columnIndex],
          name,
          type,
          options: options || [],
        };
      }
    },

    deleteColumn: (state, action) => {
      const columnId = action.payload;
      state.columns = state.columns.filter((col) => col.id !== columnId);
      state.rows.forEach((row) => {
        delete row.data[columnId];
      });
    },

    addRow: (state) => {
      const newRow = {
        id: `row_${Date.now()}`,
        data: {},
      };
      state.rows.push(newRow);
    },

    deleteRow: (state, action) => {
      const rowId = action.payload;
      state.rows = state.rows.filter((row) => row.id !== rowId);
    },

    updateCell: (state, action) => {
      const { rowId, columnId, value } = action.payload;
      const row = state.rows.find((r) => r.id === rowId);
      if (row) {
        row.data[columnId] = value;
      }
    },

    clearTable: (state) => {
      state.columns = [];
      state.rows = [];
    },

    clearRows: (state) => {
      state.rows = [];
    },

    reorderColumns: (state, action) => {
      const { fromIndex, toIndex } = action.payload;
      const [movedColumn] = state.columns.splice(fromIndex, 1);
      state.columns.splice(toIndex, 0, movedColumn);
    },
    
    reorderRows: (state, action) => {
      const { draggedRowId, targetRowId } = action.payload;
      const fromIndex = state.rows.findIndex((row) => row.id === draggedRowId);
      const toIndex = state.rows.findIndex((row) => row.id === targetRowId);
      
      if (fromIndex !== -1 && toIndex !== -1) {
        const [movedRow] = state.rows.splice(fromIndex, 1);
        state.rows.splice(toIndex, 0, movedRow);
      }
    },
  },
});

export const {
  addColumn,
  updateColumn,
  deleteColumn,
  addRow,
  deleteRow,
  updateCell,
  clearTable,
  clearRows,
    reorderColumns,  
  reorderRows,
} = tableSlice.actions;

export default tableSlice.reducer;