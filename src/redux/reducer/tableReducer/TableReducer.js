import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../resetReducer/ResetReducer";

const initialState = {
  columns: [],
  rows: [],
  tableData: null,
  tableLoading: false,
  tableError: null,
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
      state.columns.unshift(newColumn);
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
    fetchTableDataStart: (state) => {
      state.tableLoading = true;
      state.tableError = null;
    },
    fetchTableDataSuccess: (state, action) => {
      state.tableLoading = false;
      state.tableData = action.payload;
      state.tableError = null;

      if (
        action.payload &&
        action.payload.data &&
        Array.isArray(action.payload.data)
      ) {
        const firstGroup = action.payload.data[0];

        if (firstGroup && firstGroup.rows && firstGroup.rows.length > 0) {
          const headerRow = firstGroup.rows.find(
            (row) => row.type === "header"
          );

          if (headerRow && headerRow.columns) {
            state.columns = headerRow.columns
              .sort((a, b) => a.column_index - b.column_index)
              .map((col) => {
                let mappedType = "text";
                let options = [];

                switch (col.column_type) {
                  case "fixed":
                  case "text":
                    mappedType = "text";
                    break;
                  case "date":
                    mappedType = "date";
                    break;
                  case "file":
                    mappedType = "file";
                    break;
                  case "dropdown":
                    mappedType = "single-select";
                    break;
                  case "multiDropdown":
                    mappedType = "multi-select";
                    break;
                  case "users":
                    mappedType = "text";
                    break;
                  default:
                    mappedType = "text";
                }

                return {
                  id: `col_${col.id}`,
                  name: col.name,
                  type: mappedType,
                  options: options,
                  apiId: col.id,
                  columnIndex: col.column_index,
                };
              });
          }

          const dataRows = firstGroup.rows.filter((row) => row.type === "data");

          state.rows = dataRows.map((row) => {
            const rowData = {};

            if (row.columns && Array.isArray(row.columns)) {
              row.columns.forEach((col) => {
                const columnId = `col_${
                  headerRow.columns[col.column_index]?.id || col.column_index
                }`;
                let cellValue = "";

                if (col.cell_data) {
                  switch (col.column_type) {
                    case "fixed":
                    case "text":
                      cellValue = col.cell_data || "";
                      break;

                    case "date": {
                      const rawDate = col.cell_data;
                      if (rawDate) {
                        const parsedDate = new Date(rawDate);
                        if (!isNaN(parsedDate)) {
                          cellValue = parsedDate.toISOString().split("T")[0];
                        } else {
                          console.warn(`Invalid date encountered:`, rawDate);
                          cellValue = "";
                        }
                      } else {
                        cellValue = "";
                      }
                      break;
                    }

                    case "users":
                      if (
                        Array.isArray(col.cell_data) &&
                        col.cell_data.length > 0
                      ) {
                        cellValue = {
                          text: col.cell_data.map((u) => u.user).join(", "),
                          users: col.cell_data,
                        };
                      }
                      break;

                    case "dropdown":
                      if (col.cell_data && col.cell_data.status_text) {
                        cellValue = {
                          text: col.cell_data.status_text,
                          color: col.cell_data.status_color || "#e0e0eb",
                          id: col.cell_data.id,
                        };
                      }
                      break;

                    case "multiDropdown":
                      if (
                        Array.isArray(col.cell_data) &&
                        col.cell_data.length > 0
                      ) {
                        cellValue = col.cell_data.map((item) => ({
                          text: item.status_text,
                          color: item.status_color || "#e0e0eb",
                          id: item.id,
                        }));
                      } else {
                        cellValue = [];
                      }
                      break;

                    case "file":
                      cellValue = col.cell_data || "";
                      break;

                    default:
                      cellValue =
                        typeof col.cell_data === "object" ? "" : col.cell_data;
                  }
                }

                rowData[columnId] = cellValue;
              });
            }

            return {
              id: `row_${row.id}`,
              data: rowData,
              apiId: row.id,
              rowIndex: row.row_index,
            };
          });

          state.columns.forEach((column) => {
            if (
              column.type === "single-select" ||
              column.type === "multi-select"
            ) {
              const optionsMap = new Map();

              dataRows.forEach((row) => {
                const col = row.columns.find(
                  (c) => c.column_index === column.columnIndex
                );
                if (col && col.cell_data) {
                  if (
                    column.type === "single-select" &&
                    col.cell_data.status_text
                  ) {
                    optionsMap.set(col.cell_data.status_text, {
                      text: col.cell_data.status_text,
                      color: col.cell_data.status_color || "#e0e0eb",
                      id: col.cell_data.id,
                    });
                  } else if (
                    column.type === "multi-select" &&
                    Array.isArray(col.cell_data)
                  ) {
                    col.cell_data.forEach((item) => {
                      if (item.status_text) {
                        optionsMap.set(item.status_text, {
                          text: item.status_text,
                          color: item.status_color || "#e0e0eb",
                          id: item.id,
                        });
                      }
                    });
                  }
                }
              });

              column.options = Array.from(optionsMap.values());
            }
          });
        }
      }
    },
    fetchTableDataFailure: (state, action) => {
      state.tableLoading = false;
      state.tableError = action.payload;
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
  fetchTableDataStart,
  fetchTableDataSuccess,
  fetchTableDataFailure,
} = tableSlice.actions;

export default tableSlice.reducer;
