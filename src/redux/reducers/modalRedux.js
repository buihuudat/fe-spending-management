import { createSlice } from "@reduxjs/toolkit";

const initialState = { 
  open: false,
  darkmode: false,
}

export const modalRedux = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setModal: (state, action) => {
      state.open = action.payload
    },
    setDarkmode: (state, action) => {
      state.darkmode = action.payload
    }
  }
})

export const { setModal, setDarkmode } = modalRedux.actions;

export default modalRedux.reducer;