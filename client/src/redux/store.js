import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import auth from './slices/authSlice';
import alert from './slices/alertSlice';
import banner from './slices/bannerSlice';
import brand from './slices/brandSlice';
import cart from './slices/cartSlice';
import category from './slices/categorySlice';
import checkout from './slices/checkoutSlice';
import compare from './slices/compareSlice';
import dashboard from './slices/dashboardSlice';
import discount from './slices/discountSlice';
import homeProduct from './slices/homeProductSlice';
import homeCategory from './slices/homeCategorySlice';
import newsletter from './slices/newsletterSlice';
import notification from './slices/notificationSlice';
import paymentMethod from './slices/paymentMethodSlice';
import product from './slices/productSlice';
import qna from './slices/qnaSlice';
import review from './slices/reviewSlice';
import recipient from './slices/recipientSlice';
import shipping from './slices/shippingSlice';
import subscriber from './slices/subscriberSlice';
import transaction from './slices/transactionSlice';
import user from './slices/userSlice';
import wishlist from './slices/wishlistSlice';

const rootReducer = combineReducers({
  auth,
  alert,
  banner,
  brand,
  cart,
  category,
  checkout,
  compare,
  dashboard,
  discount,
  homeProduct,
  homeCategory,
  newsletter,
  notification,
  paymentMethod,
  product,
  qna,
  recipient,
  review,
  shipping,
  subscriber,
  transaction,
  user,
  wishlist,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const DataProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default DataProvider;
