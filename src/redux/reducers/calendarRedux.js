import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  date: undefined
}

export const calendarRedux = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setDate: (state, action) => {
      state.date = action.payload
    }
  }
})

export const { setDate } = calendarRedux.actions;

export default calendarRedux.reducer;