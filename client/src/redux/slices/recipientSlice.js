import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/// You can only pass one argument to the thunk when you dispatch it.
// If you need to pass multiple values, pass them in a single object
export const setRecipient = createAsyncThunk(
  'recipient/set',
  async (jobData, thunkAPI) => {
    try {
      // If you need to pass in multiple values, pass them together in an object when you dispatch the thunk,
      // like dispatch(fetchUsers({status: 'active', sortBy: 'name'})).

      thunkAPI.dispatch({
        type: 'recipient/set',
        payload: jobData,
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
  recipientName: '',
  recipientPhone: '',
  recipientEmail: '',
};

const recipientSlice = createSlice({
  name: 'recipient',
  initialState,
  reducers: {
    set: (state, action) => {
      return action.payload;
    },
    reset: (state, action) => {
      return {
        recipientName: '',
        recipientPhone: '',
        recipientEmail: '',
      };
    },
  },
});

export default recipientSlice.reducer;
