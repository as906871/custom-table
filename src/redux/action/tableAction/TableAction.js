import axios from "axios";
import { fetchTableDataFailure, fetchTableDataStart, fetchTableDataSuccess } from "../../reducer/tableReducer/TableReducer";

let isGetTableData = false;

export const GetTableSheetData = (projectId, scheduleId) => async (dispatch) => {
  if (isGetTableData) return;
  isGetTableData = true;
 
  dispatch(fetchTableDataStart());
  try {
    const response = await axios.get(
      `https://schedule.msarii.com/hotwash/whole-sheet-data/${projectId}/${scheduleId}/`
    );
   
    if (response.status !== 200) {
      throw new Error("Failed to fetch sheet data.");
    }
   
    console.log("API Response:", response?.data);
    dispatch(fetchTableDataSuccess(response?.data));
  } catch (error) {
    console.error("Error fetching sheet data:", error);
    dispatch(fetchTableDataFailure(error.message));
  } finally {
    isGetTableData = false;
  }
};
