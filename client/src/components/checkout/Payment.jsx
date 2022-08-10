import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCheckoutPayment } from './../../redux/slices/paymentMethodSlice';

const Payment = ({ setCurrPage }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!phoneNumber) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          errors: 'Please provide your OVO phone number.',
        },
      });
    }

    dispatch(setCheckoutPayment({ phoneNumber: '38' + phoneNumber }));
    setCurrPage('review');
  };

  useEffect(() => {
    const tempPaymentData = JSON.parse(
      localStorage.getItem('learnify_payment')
    );
    if (tempPaymentData) {
      setPhoneNumber(tempPaymentData.phoneNumber);
    }
  }, []);

  return (
    <div className="mt-8 font-opensans">
      <h1 className="text-2xl mb-4">Payment Details</h1>
      <div className="flex items-center mb-6 gap-4">
        <div className="ounded-md p-2 border-blue-500 border-2">
          <img
            src={`${process.env.PUBLIC_URL}/images/Pay-Logo.png`}
            alt="Let's work || Payment"
            width={60}
          />
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="phoneNumber" className="text-gray-500">
            WE Phone Number
          </label>
          <div className="flex gap-2 mt-3">
            <p className="border border-gray-300 py-2 px-3 rounded-md">+38</p>
            <input
              type="number"
              autoComplete="off"
              id="phoneNumber"
              name="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border border-gray-300 rounded-md outline-0 p-2 text-sm"
            />
          </div>
        </div>
        <button className="bg-[#3552DC] hover:bg-[#122DB0] transition-[background] rounded-md text-sm text-white px-7 py-2">
          Review Order
        </button>
      </form>
    </div>
  );
};

export default Payment;
