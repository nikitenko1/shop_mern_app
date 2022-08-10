import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GrMapLocation } from 'react-icons/gr';
import { IoIosHome } from 'react-icons/io';
import { MdDeliveryDining } from 'react-icons/md';
import { checkoutCart } from '../../redux/slices/checkoutSlice';
import Loader from '../global/Loader';

const CheckoutReview = () => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const [accountData, setAccountData] = useState({
    recipientName: '',
    recipientPhone: '',
    recipientEmail: '',
  });

  const [shippingData, setShippingData] = useState({
    province: '',
    city: '',
    district: '',
    postalCode: '',
    address: '',
    expedition: '',
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth, alert, cart } = useSelector((state) => state);

  const handleClickCheckout = async () => {
    const checkoutData = {
      ...accountData,
      ...shippingData,
      // expeditionFee: shippingData.courierFee,
      expeditionFee: 20,
      payPhoneNumber: phoneNumber,
      discount: localStorage.getItem('learnify_checkoutDiscount')
        ? JSON.parse(localStorage.getItem('learnify_checkoutDiscount'))
        : {},
      items: cart.map((item) => ({
        ...item,
        discount: item.product.discount,
        product: item.product._id,
      })),
      totalPrice: 0,
    };

    checkoutData.totalPrice =
      cart.reduce(
        (acc, item) =>
          acc +
          (item.product
            ? (item.product.price -
                (item.product.discount * item.product.price) / 100) *
              item.qty
            : parseInt(item.price) * item.qty),
        0
      ) +
      // shippingData.courierFee -
      20 -
      (Object.keys(checkoutData.discount).length === 0
        ? 0
        : (checkoutData.discount.value / 100) *
          cart.reduce(
            (acc, item) =>
              acc +
              (item.product
                ? (item.product.price -
                    (item.product.discount * item.product.price) / 100) *
                  item.qty
                : parseInt(item.price) * item.qty),
            0
          ));

    dispatch(
      checkoutCart({
        checkoutData: { ...checkoutData },
        token: `${auth.token}`,
      })
    );

    dispatch({
      type: 'cart/reset',
      payload: [],
    });

    localStorage.removeItem('learnify_recipient');
    localStorage.removeItem('learnify_shipping');
    localStorage.removeItem('learnify_checkoutDiscount');
    localStorage.removeItem('learnify_payment');

    dispatch({ type: 'recipient/reset' });
    dispatch({ type: 'shipping/reset' });
    dispatch({ type: 'paymentMethod/reset' });

    navigate('/');
  };

  useEffect(() => {
    const tempAccountData = JSON.parse(
      localStorage.getItem('learnify_recipient')
    );
    if (tempAccountData) {
      setAccountData(tempAccountData);
    }
  }, []);

  useEffect(() => {
    const tempPaymentData = JSON.parse(
      localStorage.getItem('learnify_payment')
    );
    if (tempPaymentData) {
      setPhoneNumber(tempPaymentData.phoneNumber);
    }
  }, []);

  useEffect(() => {
    const tempShippingData = JSON.parse(
      localStorage.getItem('learnify_shipping')
    );
    if (tempShippingData) {
      setShippingData(tempShippingData);
    }
  }, []);

  return (
    <div className="mt-8 font-opensans overflow-auto md:h-[70vh] hide-scrollbar">
      <h1 className="text-2xl mb-6">Review Order</h1>
      <div>
        <p className="mb-3 text-gray-500 font-bold">Recipient</p>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <label htmlFor="name" className="text-sm">
              Name
            </label>
            <input
              type="text"
              disabled
              value={accountData.recipientName}
              className="w-full border border-gray-300 bg-gray-100 rounded-md p-2 text-sm mt-2"
            />
          </div>
          <div>
            <label htmlFor="phone" className="text-sm">
              Phone
            </label>
            <input
              type="text"
              disabled
              id="phone"
              value={accountData.recipientPhone}
              className="w-full border border-gray-300 bg-gray-100 rounded-md p-2 text-sm mt-2"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm">
              Email
            </label>
            <input
              type="text"
              disabled
              value={accountData.recipientEmail}
              className="w-full border border-gray-300 bg-gray-100 rounded-md p-2 text-sm mt-2"
            />
          </div>
        </div>
      </div>
      <div className="mt-8">
        <p className="mb-4 text-gray-500 font-bold">Shipping</p>
        <div>
          <p className="flex items-center gap-3 text-sm mb-3">
            <GrMapLocation />
            {shippingData.postalCode}
          </p>
          <p className="flex items-center gap-3 text-sm mb-3">
            <IoIosHome />
            {shippingData.address}
          </p>
          <p className="capitalize flex items-center gap-3 text-sm">
            <MdDeliveryDining className="text-md" />
            {shippingData.expedition}
          </p>
        </div>
      </div>
      <div className="mt-8">
        <p className="mb-3 text-gray-500 font-bold">Payment Detail</p>
        <div className="border border-gray-300 w-fit p-2 rounded-md mb-4">
          <img
            src={`${process.env.PUBLIC_URL}/images/Pay-Logo.png`}
            alt="Learnify Payment"
            width={60}
          />
        </div>
        <div className="flex-1">
          <label className="text-sm">Phone Number</label>
          <input
            type="text"
            disabled
            value={phoneNumber}
            className="w-full border border-gray-300 bg-gray-100 rounded-md p-2 text-sm mt-2"
          />
        </div>
      </div>
      <button
        onClick={handleClickCheckout}
        disabled={alert.loading ? true : false}
        className={`${
          alert.loading
            ? 'bg-blue-300 hover:bg-blue-300'
            : 'bg-[#3552DC] hover:bg-[#122DB0]'
        } transition-[background] text-sm text-white rounded-full px-5 py-2 mt-6 float-right`}
      >
        {alert.loading ? <Loader /> : 'Checkout'}
      </button>
      <div className="clear-both" />
    </div>
  );
};

export default CheckoutReview;
