import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkTokenExp } from '../../utils/checkTokenExp';
import { deleteDataAPI, getDataAPI, postDataAPI } from '../../utils/fetchData';

/// You can only pass one argument to the thunk when you dispatch it.
// If you need to pass multiple values, pass them in a single object
export const addWishlist = createAsyncThunk(
  'wishlist/create',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      // If you need to pass in multiple values, pass them together in an object when you dispatch the thunk,
      // like dispatch(fetchUsers({status: 'active', sortBy: 'name'})).
      const res = await postDataAPI(
        'wishlist',
        { product: jobData.data },
        accessToken
      );

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

export const getWishlist = createAsyncThunk(
  'wishlist/get',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;
    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await getDataAPI('wishlist', accessToken);

      thunkAPI.dispatch({ type: 'alert/alert', payload: {} });

      thunkAPI.dispatch({
        type: 'wishlist/get',
        payload: { data: res.data.wishlists },
      });
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

export const deleteWishlist = createAsyncThunk(
  'wishlist/delete',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await deleteDataAPI(`wishlist/${jobData.id}`, accessToken);

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { success: res.data.msg },
      });
      return {};
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

const initialState = {
  data: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    create: (state, action) => {
      return {
        ...state,
        data: [...action.payload, ...state.data],
      };
    },
    get: (state, action) => {
      return {
        ...state,
        data: action.payload.data, // new data array
      };
    },
    delete: (state, action) => {
      return {
        ...state,
        data: state.data.filter((item) => item._id !== action.payload),
      };
    },
    reset: (state, action) => {
      return {
        ...state,
        data: action.payload.data, // new data array
      };
    },
  },
});

export default wishlistSlice.reducer;
