import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkTokenExp } from '../../utils/checkTokenExp';
import { getDataAPI, patchDataAPI, postDataAPI } from '../../utils/fetchData';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

// You can only pass one argument to the thunk when you dispatch it.
// If you need to pass multiple values, pass them in a single object
export const createNotification = createAsyncThunk(
  'notification/create',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;
    try {
      const res = await postDataAPI('notification', jobData.data, accessToken);

      socket.emit('createNotification', res.data.notification);

      thunkAPI.dispatch({
        type: 'notification/create',
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

export const getNotification = createAsyncThunk(
  'notification/get',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;
    try {
      const res = await getDataAPI('notification', accessToken);

      thunkAPI.dispatch({
        type: 'notification/get',
        payload: res.data.notifications,
      });
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

export const readNotification = createAsyncThunk(
  'notification/read',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;
    try {
      await patchDataAPI(`notification/${jobData.id}`, {}, accessToken);

      thunkAPI.dispatch({
        type: 'notification/read',
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

const initialState = [];

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    create: (state, action) => {
      return [action.payload, ...state];
    },
    get: (state, action) => {
      return action.payload;
    },
    read: (state, action) => {
      return state.map((item) =>
        item._id === action.payload ? { ...item, isRead: true } : item
      );
    },
  },
});

export default notificationSlice.reducer;
