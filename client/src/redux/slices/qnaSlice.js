import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkTokenExp } from '../../utils/checkTokenExp';
import { getDataAPI, patchDataAPI, postDataAPI } from '../../utils/fetchData';

/// You can only pass one argument to the thunk when you dispatch it.
// If you need to pass multiple values, pass them in a single object
export const createQna = createAsyncThunk(
  'qna/create',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      // If you need to pass in multiple values, pass them together in an object when you dispatch the thunk,
      // like dispatch(fetchUsers({status: 'active', sortBy: 'name'})).
      const res = await postDataAPI('qna', jobData.qnaData, accessToken);

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { success: res.data.msg },
      });
      thunkAPI.dispatch({
        type: 'qna/create',
        payload: res.data.qna,
      });
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

export const getQna = createAsyncThunk('qna/get', async (jobData, thunkAPI) => {
  try {
    thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

    const res = await getDataAPI(`qna/${jobData.id}`);

    thunkAPI.dispatch({
      type: 'qna/get',
      payload: res.data.qnas,
    });
  } catch (err) {
    thunkAPI.dispatch({
      type: 'alert/alert',
      payload: { error: err.response.data.msg },
    });
  }
});

export const likeQna = createAsyncThunk(
  'qna/like',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      const res = await patchDataAPI(
        `qna/like/${jobData.id}`,
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

export const unlikeQna = createAsyncThunk(
  'qna/unlike',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      const res = await patchDataAPI(
        `qna/unlike/${jobData.id}`,
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
};

const qnaSlice = createSlice({
  name: 'qna',
  initialState,
  reducers: {
    create: (state, action) => {
      return {
        ...state,
        data: [action.payload, ...state.data],
      };
    },
    get: (state, action) => {
      return {
        ...state,
        data: action.payload,
      };
    },
    like: (state, action) => {
      return {
        ...state,
        data: state.data.map((item) =>
          item._id === action.payload.id
            ? { ...item, likes: [...item.likes, action.payload.user] }
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
                likes: item.likes.filter(
                  (like) => like !== action.payload.user
                ),
              }
            : item
        ),
      };
    },
  },
});

export default qnaSlice.reducer;
