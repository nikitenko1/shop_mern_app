import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkTokenExp } from '../../utils/checkTokenExp';
import { getDataAPI, postDataAPI } from './../../utils/fetchData';
import { createNotification } from './notificationSlice';
import { numberFormatter } from '../../utils/numberFormatter';

/// You can only pass one argument to the thunk when you dispatch it.
// If you need to pass multiple values, pass them in a single object
export const checkoutCart = createAsyncThunk(
  'checkout/create',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });
      // If you need to pass in multiple values, pass them together in an object when you dispatch the thunk,
      // like dispatch(fetchUsers({status: 'active', sortBy: 'name'})).
      const res = await postDataAPI(
        'checkout',
        { ...jobData.checkoutData },
        accessToken
      );

      thunkAPI.dispatch(
        createNotification(
          {
            transaction: res.data.checkout._id,
            message: `${res.data.user} just create a transaction with total ${
              res.data.checkout.items.length
            } ${
              res.data.checkout.items.length > 1 ? 'Items' : 'Item'
            }, and price ${numberFormatter(res.data.checkout.totalPrice)}`,
          },
          accessToken
        )
      );

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { success: res.data.msg },
      });

      thunkAPI.dispatch({
        type: 'checkout/create',
        payload: res.data.checkout,
      });
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

export const getCheckoutHistory = createAsyncThunk(
  'checkout/get_history',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;
    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await getDataAPI('checkout', accessToken);

      thunkAPI.dispatch({ type: 'alert/alert', payload: {} });

      thunkAPI.dispatch({
        type: 'checkout/get_history',
        payload: res.data.checkouts,
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

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    create: (state, action) => {
      return {
        ...state,
        data: [action.payload, ...state.data],
      };
    },
    get_history: (state, action) => {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
});

export default checkoutSlice.reducer;
