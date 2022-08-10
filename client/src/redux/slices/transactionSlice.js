import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkTokenExp } from '../../utils/checkTokenExp';
import { getDataAPI } from './../../utils/fetchData';

// You can only pass one argument to the thunk when you dispatch it.
// If you need to pass multiple values, pass them in a single object
export const getAllTransactions = createAsyncThunk(
  'transaction/get',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;
    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await getDataAPI(
        `checkout/transaction?page=${jobData.page}`,
        accessToken
      );

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {},
      });

      thunkAPI.dispatch({
        type: 'transaction/get',
        payload: {
          data: res.data.transactions,
          totalPage: res.data.totalPage,
        },
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
  totalPage: 0,
  data: [],
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    get: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export default transactionSlice.reducer;
