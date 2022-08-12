import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAdmin: false,
  users: {}
};

export const getAllUserRedux = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      state.isAdmin = action.payload
    },
    setAU: (state, action) => {
      state.users = action.payload
    }
  }
})

export const { setAdmin, setAU } = getAllUserRedux.actions;
export default getAllUserRedux.reducer
