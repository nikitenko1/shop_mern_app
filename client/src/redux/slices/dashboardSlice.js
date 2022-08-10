import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkTokenExp } from '../../utils/checkTokenExp';
import { getDataAPI } from '../../utils/fetchData';

// You can only pass one argument to the thunk when you dispatch it.
// If you need to pass multiple values, pass them in a single object
export const getDashboardData = createAsyncThunk(
  'dashboard/get',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;
    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await getDataAPI('dashboard', accessToken);

      thunkAPI.dispatch({
        type: 'dashboard/get',
        payload: res.data,
      });

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: res.data,
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
  totalUser: 0,
  totalTransaction: 0,
  totalProduct: 0,
  totalBrand: 0,
  totalCategory: 0,
  monthlyTransaction: [],
  userGrowth: [],
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    get: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export default dashboardSlice.reducer;
