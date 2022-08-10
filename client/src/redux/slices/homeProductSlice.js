import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDataAPI } from './../../utils/fetchData';

// You can only pass one argument to the thunk when you dispatch it.
// If you need to pass multiple values, pass them in a single object
export const getHomeProduct = createAsyncThunk(
  'homeProduct/get',
  async (jobData, thunkAPI) => {
    let brandQueryStr = '';
    let sizeQueryStr = '';
    let colorQueryStr = '';

    if (jobData.selectedBrand.length > 0) {
      for (let i = 0; i < jobData.selectedBrand.length; i++) {
        if (i !== jobData.selectedBrand.length - 1)
          brandQueryStr += `brand=${jobData.selectedBrand[i]}&`;
        else brandQueryStr += `brand=${jobData.selectedBrand[i]}`;
      }
    }

    if (jobData.selectedSize.length > 0) {
      for (let i = 0; i < jobData.selectedSize.length; i++) {
        if (i !== jobData.selectedSize.length - 1)
          sizeQueryStr += `sizes=${jobData.selectedSize[i]}&`;
        else sizeQueryStr += `sizes=${jobData.selectedSize[i]}`;
      }
    }

    if (jobData.selectedColor.length > 0) {
      for (let i = 0; i < jobData.selectedColor.length; i++) {
        if (i !== jobData.selectedColor.length - 1)
          colorQueryStr += `colors=${jobData.selectedColor[i]}&`;
        else colorQueryStr += `colors=${jobData.selectedColor[i]}`;
      }
    }
    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      let url = `product/home?category=${jobData.selectedCategory}&${brandQueryStr}&${sizeQueryStr}&${colorQueryStr}&page=${jobData.selectedPage}&sortBy=${jobData.sortBy}&sortType=${jobData.sortType}`;

      if (jobData.selectedPrice.length > 0) {
        url += `&gt=${jobData.selectedPrice[0]}&lt=${jobData.selectedPrice[1]}`;
      }

      const res = await getDataAPI(url);

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {},
      });

      thunkAPI.dispatch({
        type: 'homeProduct/get',
        payload: {
          products: res.data.products,
          totalPage: res.data.totalPage,
          maxPrice: res.data.maxPrice,
          minPrice: res.data.minPrice,
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

//
const initialState = {
  data: [],
  totalPage: 0,
  maxPrice: 0,
  minPrice: 0,
};

const homeProductSlice = createSlice({
  name: 'homeProduct',
  initialState,
  reducers: {
    get: (state, action) => {
      return {
        ...state,
        data: action.payload,
        totalPage: action.payload.totalPage,
        maxPrice: action.payload.maxPrice,
        minPrice: action.payload.minPrice,
      };
    },
  },
});

export default homeProductSlice.reducer;
