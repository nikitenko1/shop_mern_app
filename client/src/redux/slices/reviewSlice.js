import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkTokenExp } from '../../utils/checkTokenExp';
import { getDataAPI, patchDataAPI, postDataAPI } from '../../utils/fetchData';

/// You can only pass one argument to the thunk when you dispatch it.
// If you need to pass multiple values, pass them in a single object
export const createReview = createAsyncThunk(
  'review/create',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      // If you need to pass in multiple values, pass them together in an object when you dispatch the thunk,
      // like dispatch(fetchUsers({status: 'active', sortBy: 'name'})).
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await postDataAPI('review', jobData.reviewData, accessToken);

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { success: res.data.msg },
      });

      thunkAPI.dispatch({
        type: 'review/create',
        payload: res.data.review,
      });
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

export const getReview = createAsyncThunk(
  'review/get',
  async (jobData, thunkAPI) => {
    try {
      const res = await getDataAPI(`review/${jobData.id}?page=${jobData.page}`);

      thunkAPI.dispatch({
        type: 'review/get',
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

export const likeReview = createAsyncThunk(
  'review/like',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      // If you need to pass in multiple values, pass them together in an object when you dispatch the thunk,
      // like dispatch(fetchUsers({status: 'active', sortBy: 'name'})).
      const res = await patchDataAPI(
        `review/like/${jobData.id}`,
        jobData.product,
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

export const unlikeReview = createAsyncThunk(
  'review/unlike',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      // If you need to pass in multiple values, pass them together in an object when you dispatch the thunk,
      // like dispatch(fetchUsers({status: 'active', sortBy: 'name'})).
      const res = await patchDataAPI(
        `review/unlike/${jobData.id}`,
        jobData.product,
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

const initialState = {
  data: [],
  totalPage: 0,
  isOpen: false,
};

const wishlistSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    open_modal: (state, action) => {
      return {
        ...state,
        isOpen: action.payload,
      };
    },
    create: (state, action) => {
      return {
        ...state,
        data: [action.payload, ...state.data],
      };
    },
    get: (state, action) => {
      return {
        ...state,
        data: action.payload.reviews,
        totalPage: action.payload.totalPage,
      };
    },
    like: (state, action) => {
      return {
        ...state,
        data: state.data.map((item) =>
          item._id === action.payload.id
            ? { ...item, like: [...item.like, action.payload.user] }
            : item
        ),
      };
    },
    unlike: (state, action) => {
      return {
        ...state,
        data: state.data.map((item) =>
          item._id === action.payload.id
            ? {
                ...item,
                like: item.like.filter((i) => i !== action.payload.user),
              }
            : item
        ),
      };
    },
  },
});

export default wishlistSlice.reducer;
