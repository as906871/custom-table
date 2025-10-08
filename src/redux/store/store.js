import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import sidebarReducer from "../reducer/sidebarReducer/SidebarReducer";
import tableReducer from "../reducer/tableReducer/TableReducer";

const tablePersistConfig = {
  key: "table",
  storage,
};

const rootReducer = combineReducers({
  table: persistReducer(tablePersistConfig, tableReducer),
  sidebar: sidebarReducer,
});

export const store = configureStore({
  reducer: rootReducer, 
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);