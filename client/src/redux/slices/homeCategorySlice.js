import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDataAPI } from './../../utils/fetchData';

// You can only pass one argument to the thunk when you dispatch it.
// If you need to pass multiple values, pass them in a single object
export const getHomeCategory = createAsyncThunk(
  'homeCategory/get',
  async (_, thunkAPI) => {
    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await getDataAPI('category/home');

      thunkAPI.dispatch({ type: 'alert/alert', payload: {} });

      thunkAPI.dispatch({
        type: 'homeCategory/get',
        payload: res.data.categories,
      });
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

//
const initialState = {
  data: [],
};

const homeCategorySlice = createSlice({
  name: 'homeCategory',
  initialState,
  reducers: {
    get: (state, action) => {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
});

export default homeCategorySlice.reducer;
