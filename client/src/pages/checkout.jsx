import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCart } from './../redux/slices/cartSlice';
import Navbar from './../components/global/Navbar';
import Footer from './../components/global/Footer';
import NotFound from './../components/global/NotFound';
import { getDataAPI } from '../utils/fetchData';
import CheckoutLine from './../components/checkout/CheckoutLine';
import Account from './../components/checkout/Account';
import Shipping from './../components/checkout/Shipping';
import Payment from './../components/checkout/Payment';
import HeadInfo from '../utils/HeadInfo';
import CheckoutReview from '../components/checkout/CheckoutReview';
import { numberFormatter } from '../utils/numberFormatter';

const Checkout = () => {
  const [discount, setDiscount] = useState('');
  const [discountValue, setDiscountValue] = useState(0);
  const [currPage, setCurrPage] = useState('account');

  const dispatch = useDispatch();
  const { auth, cart } = useSelector((state) => state);

  const checkDiscount = async () => {
    if (!discount) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'Please provide discount code.',
        },
      });
    }
    // return res.status(200).json({ discount });
    // const discountSchema = new mongoose.Schema(
    //   {
    //     code: {
    //       type: String,
    //       required: true,
    //       trim: true,
    //       unique: true,
    //       minlength: 4,
    //     },
    //     value: {
    //       type: Number,
    //       required: true,
    //     },
    try {
      const discountRes = await getDataAPI(`discount/${discount}`);
      setDiscountValue(discountRes.data.discount.value);
      localStorage.setItem(
        'learnify_checkoutDiscount',
        JSON.stringify({
          code: discountRes.data.discount.code,
          value: discountRes.data.discount.value,
        })
      );
      dispatch({
        type: 'alert/alert',
        payload: {
          success: `${discountRes.data.discount.value}% discount applied.`,
        },
      });
    } catch (err) {
      setDiscountValue(0);
      localStorage.setItem('learnify_checkoutDiscount', JSON.stringify({}));
      dispatch({
        type: 'alert/alert',
        payload: {
          errors: err.response.data.msg,
        },
      });
    }
  };

  useEffect(() => {
    const tempCheckoutDiscount = JSON.parse(
      localStorage.getItem('learnify_checkoutDiscount')
    );
    if (tempCheckoutDiscount) {
      setDiscountValue(tempCheckoutDiscount.value);
      setDiscount(tempCheckoutDiscount.code);
    }
  }, []);

  useEffect(() => {
    if (auth.token) {
      dispatch(getCart({ token: `${auth.token}` }));
    }
  }, [dispatch, auth.token]);

  if (auth.user?.role !== 'user' || cart.length === 0) {
    return <NotFound />;
  }

  return (
    <>
      <HeadInfo title="Checkout" />
      <Navbar />
      <div className="flex flex-col md:flex-row">
        <div className="flex-[2] lg:mx-40 lg:my-12 md:mx-12 md:my-12 m-12">
          <CheckoutLine setCurrPage={setCurrPage} />
          {currPage === 'account' ? (
            <Account setCurrPage={setCurrPage} />
          ) : currPage === 'shipping' ? (
            <Shipping setCurrPage={setCurrPage} />
          ) : currPage === 'payment' ? (
            <Payment setCurrPage={setCurrPage} />
          ) : currPage === 'review' ? (
            <CheckoutReview />
          ) : (
            ''
          )}
        </div>
        <div className="flex-1 md:border-l border-gray-300 font-opensans sm:border-b">
          <h1 className="text-xl p-7">Order Summary</h1>
          <div className="border-b border-gray-300 px-7 max-h-[240px] overflow-auto hide-scrollbar">
            {cart.map((item, idx) => (
              <div
                key={idx}
                className="font-opensans text-black flex items-center mb-6"
              >
                <div className="w-20 h-20 border border-gray-300 rounded-md flex items-center justify-center p-2">
                  <img src={item.product.images[0]} alt={item.product.name} />
                </div>
                <div className="ml-3">
                  <h2 className="font-oswald text-lg tracking-wide">
                    {item.product.name}
                  </h2>
                  <p className="mt-1 mb-2 text-sm">
                    {numberFormatter(item.product.price)} x {item.qty}
                  </p>
                  <div className="flex items-center gap-4">
                    <div
                      className="rounded-full w-5 h-5"
                      style={{ background: item.color }}
                    />
                    <p className="rounded-md bg-gray-200 px-2 py-1 text-xs w-fit">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-7 py-5 border-b border-gray-300">
            <p className="text-gray-500 mb-4">Gift Card / Discount Code</p>
            <div className="flex font-opensans gap-3">
              <input
                type="text"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="border border-gray-300 rounded-md p-2 outline-0 text-sm flex-[3]"
              />
              <button
                onClick={checkDiscount}
                className="text-sm rounded-md text-white bg-[#3552DC] hover:bg-[#122DB0] transition-[background] flex-1"
              >
                Apply
              </button>
            </div>
          </div>
          <div className="px-7 py-5 flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <p>Subtotal</p>
              <p>
                {numberFormatter(
                  cart.reduce(
                    (acc, item) =>
                      acc +
                      (item.product
                        ? (item.product.price -
                            (item.product.discount * item.product.price) /
                              100) *
                          item.qty
                        : parseInt(item.price) * item.qty),
                    0
                  )
                )}
              </p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <p>Discount</p>
              <p>
                -{' '}
                {discountValue === 0
                  ? 0
                  : numberFormatter(
                      (discountValue / 100) *
                        cart.reduce(
                          (acc, item) =>
                            acc +
                            (item.product
                              ? (item.product.price -
                                  (item.product.discount * item.product.price) /
                                    100) *
                                item.qty
                              : parseInt(item.price) * item.qty),
                          0
                        )
                    )}
              </p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <p>Shipping</p>
              {/* <p>{numberFormatter(shipping.courierFee)}</p> */}
              <p>{numberFormatter(20)}</p>
            </div>
            <div className="font-bold flex items-center justify-between">
              <p>Total</p>
              <p>
                {numberFormatter(
                  cart.reduce(
                    (acc, item) =>
                      acc +
                      (item.product
                        ? (item.product.price -
                            (item.product.discount * item.product.price) /
                              100) *
                          item.qty
                        : parseInt(item.price) * item.qty),
                    0
                  ) +
                    // shipping.courierFee -
                    20 -
                    (discountValue / 100) *
                      cart.reduce(
                        (acc, item) =>
                          acc +
                          (item.product
                            ? (item.product.price -
                                (item.product.discount * item.product.price) /
                                  100) *
                              item.qty
                            : parseInt(item.price) * item.qty),
                        0
                      )
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
