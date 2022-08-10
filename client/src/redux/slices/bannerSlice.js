import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkTokenExp } from '../../utils/checkTokenExp';
import { getDataAPI, patchDataAPI } from '../../utils/fetchData';

// You can only pass one argument to the thunk when you dispatch it.
// If you need to pass multiple values, pass them in a single object
export const getBanner = createAsyncThunk('banner/get', async (_, thunkAPI) => {
  try {
    const res = await getDataAPI('banner');

    thunkAPI.dispatch({
      type: 'banner/get',
      payload: res.data.banner,
    });
  } catch (err) {
    thunkAPI.dispatch({
      type: 'alert/alert',
      payload: { error: err.response.data.msg },
    });
  }
});

export const updateBanner = createAsyncThunk(
  'banner/update',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;
    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await patchDataAPI(
        `banner/${jobData.data[0]}`,
        { product: jobData.data[1] },
        accessToken
      );

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { success: res.data.msg },
      });

      thunkAPI.dispatch({
        type: 'banner/update',
        payload: res.data.banner,
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
const bannerSlice = createSlice({
  name: 'banner',
  initialState,
  reducers: {
    get: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    update: (state, action) => {
      return {
        ...state,
        data: state.data.map((item) =>
          item._id === action.payload._id ? action.payload : item
        ),
      };
    },
  },
});

export default bannerSlice.reducer;
