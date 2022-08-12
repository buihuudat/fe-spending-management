import { createSlice } from '@reduxjs/toolkit';

const initialState = { data: {}, targets: {} }

export const StatisticsRedux = createSlice({
  name: 'statistics',
  initialState,
  reducers: {
    setStatistics: (state, action) => {
      state.data = action.payload
    },

    setTargets: (state, action) => {
      state.targets = action.payload
    }
  }
})

export const { setStatistics, setTargets } = StatisticsRedux.actions;

export default StatisticsRedux.reducer;