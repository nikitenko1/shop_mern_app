import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkTokenExp } from '../../utils/checkTokenExp';
import { getDataAPI, postDataAPI } from '../../utils/fetchData';

// You can only pass one argument to the thunk when you dispatch it.
// If you need to pass multiple values, pass them in a single object
export const getNewsletters = createAsyncThunk(
  'newsletter/get',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await getDataAPI(
        `newsletter?page=${jobData.page}`,
        accessToken
      );

      thunkAPI.dispatch({ type: 'alert/alert', payload: {} });

      thunkAPI.dispatch({
        type: 'newsletter/get',
        payload: {
          data: res.data.newsletters,
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

export const createNewsletter = createAsyncThunk(
  'newsletter/create',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await postDataAPI('newsletter', jobData.data, accessToken);

      thunkAPI.dispatch({
        type: 'newsletter/create',
        payload: res.data.newsletter,
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

//
const initialState = {
  data: [],
  totalPage: 0,
};

const newsletterSlice = createSlice({
  name: 'newsletter',
  initialState,
  reducers: {
    get: (state, action) => {
      return { ...action.payload };
    },
    create: (state, action) => {
      return {
        ...state,
        data: [...action.payload, ...state.data],
      };
    },
  },
});

export default newsletterSlice.reducer;
