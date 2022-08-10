import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {},
  isOpen: false,
};

const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    open: (state, action) => {
      return {
        ...state,
        data: {},
        isOpen: action.payload,
      };
    },
    set_data: (state, action) => {
      return {
        ...state,
        data: action.payload,
        isOpen: true,
      };
    },
  },
});

export default compareSlice.reducer;
