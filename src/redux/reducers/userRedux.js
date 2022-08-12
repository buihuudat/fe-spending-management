import { createSlice } from "@reduxjs/toolkit";

const initialState = { value: {} };

export const userRedux = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.value = action.payload
    }
  }
})

export const { setUser } = userRedux.actions;

export default userRedux.reducer;