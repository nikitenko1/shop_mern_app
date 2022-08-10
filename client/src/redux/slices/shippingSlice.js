import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/// You can only pass one argument to the thunk when you dispatch it.
// If you need to pass multiple values, pass them in a single object
export const setShipping = createAsyncThunk(
  'shipping/set',
  async (jobData, thunkAPI) => {
    try {
      // If you need to pass in multiple values, pass them together in an object when you dispatch the thunk,
      // like dispatch(fetchUsers({status: 'active', sortBy: 'name'})).

      thunkAPI.dispatch({
        type: 'shipping/set',
        payload: { ...jobData },
      });
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

const initialState = {
  province: '',
  city: '',
  district: '',
  postalCode: '',
  address: '',
  expedition: '',
};

const shippingSlice = createSlice({
  name: 'shipping',
  initialState,
  reducers: {
    set: (state, action) => {
      return action.payload;
    },
    reset: (state, action) => {
      return {
        province: '',
        city: '',
        district: '',
        postalCode: '',
        address: '',
        expedition: '',
      };
    },
  },
});

export default shippingSlice.reducer;
