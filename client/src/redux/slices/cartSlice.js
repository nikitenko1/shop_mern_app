import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkTokenExp } from '../../utils/checkTokenExp';
import {
  getDataAPI,
  deleteDataAPI,
  postDataAPI,
} from './../../utils/fetchData';

// You can only pass one argument to the thunk when you dispatch it.
// If you need to pass multiple values, pass them in a single object
export const addToCart = createAsyncThunk(
  'cart/add',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      const resData = await getDataAPI(`product/${jobData.id}`);
      const product = resData.data.product;

      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await postDataAPI(
        'cart',
        {
          product: jobData.id,
          color: jobData.color,
          size: jobData.size,
          qty: jobData.qty,
        }, 
        accessToken
      );

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { success: res.data.msg },
      });

      thunkAPI.dispatch({
        type: 'cart/add',
        payload: {
          _id: jobData.id,
          discount: jobData.discount,
          color: jobData.color,
          size: jobData.size,
          qty: jobData.qty,
          product,
          name: product.name,
          price: product.price,
          image: product.images[0],
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

export const getCart = createAsyncThunk(
  'cart/get',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      const res = await getDataAPI('cart', accessToken);

      thunkAPI.dispatch({
        type: 'cart/get',
        payload: res.data.carts,
      });
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

export const deleteItem = createAsyncThunk(
  'cart/delete',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      if (jobData.token) {
        const res = await deleteDataAPI(
          `cart/${jobData.productId}/${jobData.productColor.substring(
            1,
            jobData.productColor.length
          )}/${jobData.productSize}`,
          accessToken
        );
        thunkAPI.dispatch({
          type: 'alert/alert',
          payload: { success: res.data.msg },
        });
      } else {
        localStorage.setItem(
          'learnify_cartItems',
          JSON.stringify(thunkAPI.getState().cart)
        );
      }
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

//
const initialState = [];

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    add: (state, action) => {
      const item = action.payload;
      const isExists = state.find(
        (i) =>
          (i._id === item._id || i.product?._id === item._id) &&
          i.color === item.color &&
          (typeof i.size === 'string' ? parseInt(i.size) : i.size) === item.size
      );
      if (isExists) {
        return state.map((i) =>
          (i._id === item._id || i.product?._id === item._id) &&
          i.color === item.color &&
          (typeof i.size === 'string' ? parseInt(i.size) : i.size) === item.size
            ? item
            : i
        );
      } else {
        return [action.payload, ...state];
      }
    },
    get: (state, action) => {
      return action.payload;
    },
    reset: (state, action) => {
      return action.payload;
    },
    delete: (state, action) => {
      state.filter(
        (item) =>
          !(
            (item._id === action.payload.productId ||
              item.product?._id === action.payload.productId) &&
            item.color === action.payload.productColor &&
            item.size === action.payload.productSize
          )
      );
    },
  },
});

export default cartSlice.reducer;
