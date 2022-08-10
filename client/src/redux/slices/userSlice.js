import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkTokenExp } from '../../utils/checkTokenExp';
import { getDataAPI } from '../../utils/fetchData';

// You can only pass one argument to the thunk when you dispatch it.
// If you need to pass multiple values, pass them in a single object
export const getAllUser = createAsyncThunk(
  'user/get_all',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;
    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await getDataAPI(`user?page=${jobData.page}`, accessToken);

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {},
      });

      thunkAPI.dispatch({
        type: 'user/get_all',
        payload: {
          data: res.data.users,
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

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    get_all: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export default userSlice.reducer;
