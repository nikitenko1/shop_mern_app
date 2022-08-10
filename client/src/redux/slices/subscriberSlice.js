import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkTokenExp } from '../../utils/checkTokenExp';
import {
  getDataAPI,
  deleteDataAPI,
  postDataAPI,
} from './../../utils/fetchData';

// You can only pass one argument to the thunk when you dispatch it.
// If you need to pass multiple values, pass them in a single object
export const getSubscriber = createAsyncThunk(
  'subscriber/get',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await getDataAPI(
        `subscriber?page=${jobData.page}`,
        accessToken
      );

      thunkAPI.dispatch({ type: 'alert/alert', payload: {} });

      thunkAPI.dispatch({
        type: 'subscriber/get',
        payload: {
          data: res.data.subscribers,
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

export const createSubscriber = createAsyncThunk(
  'subscriber/create',
  async (jobData, thunkAPI) => {
    try {
      const res = await postDataAPI('subscriber', jobData);

      thunkAPI.dispatch({
        type: 'subscriber/create',
        payload: res.data.subscriber,
      });

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { success: res.data.msg },
      });
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

export const deleteSubscriber = createAsyncThunk(
  'subscriber/delete',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await deleteDataAPI(`subscriber/${jobData.id}`, accessToken);

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { success: res.data.msg },
      });

      thunkAPI.dispatch({
        type: 'subscriber/delete',
        payload: jobData.id,
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
  totalPage: 0,
};

const subscriberSlice = createSlice({
  name: 'subscriber',
  initialState,
  reducers: {
    get: (state, action) => {
      return {
        ...state,
        data: action.payload.data, // new data array
        totalPage: action.payload.totalPage,
      };
    },
    create: (state, action) => {
      return {
        ...state,
        data: [...action.payload, ...state.data],
      };
    },
    delete: (state, action) => {
      return {
        ...state,
        data: state.data.filter((item) => item._id !== action.payload),
      };
    },
  },
});

export default subscriberSlice.reducer;
