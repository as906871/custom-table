import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../resetReducer/ResetReducer";

const initialState = {
  isOpen: true,
  position: "left",
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
  reducers: {
    toggleSidebar: (state) => {
      state.isOpen = !state.isOpen;
    },
    setSidebarPosition: (state, action) => {
      state.position = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarPosition } = sidebarSlice.actions;
export default sidebarSlice.reducer;
