import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const CheckoutLine = ({ setCurrPage }) => {
  const [currPercentage, setCurrPercentage] = useState(0);

  const { recipient, shipping, paymentMethod } = useSelector((state) => state);

  const handleChangeCurrentPage = (page) => {
    switch (page) {
      case 'account':
        setCurrPage('account');
        break;
      case 'shipping':
        if (currPercentage >= 33) {
          setCurrPage('shipping');
        }
        break;
      case 'payment':
        if (currPercentage >= 66) {
          setCurrPage('payment');
        }
        break;
      case 'review':
        if (currPercentage >= 99) {
          setCurrPage('review');
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (Object.keys(recipient).length > 0 && recipient.recipientName !== '') {
      if (currPercentage < 33) {
        setCurrPercentage(33);
      }
    }
  }, [currPercentage, recipient]);

  useEffect(() => {
    if (Object.keys(shipping).length > 0 && shipping.postalCode !== '') {
      if (currPercentage < 66) {
        setCurrPercentage(66);
      }
    }
  }, [currPercentage, shipping]);

  useEffect(() => {
    if (
      Object.keys(paymentMethod).length > 0 &&
      paymentMethod.phoneNumber !== ''
    ) {
      if (currPercentage < 99) {
        setCurrPercentage(99);
      }
    }
  }, [currPercentage, paymentMethod]);

  return (
    <div>
      <div className="relative w-full h-[2px] bg-[#BAC0BD]">
        <div
          onClick={() => handleChangeCurrentPage('account')}
          className="absolute top-50% -translate-y-[50%] left-0 w-2 h-2 rounded-full bg-[#3552DC] outline outline-[#3552DC] outline-offset-2 cursor-pointer"
        />
        <div
          onClick={() => handleChangeCurrentPage('shipping')}
          className="absolute top-50% -translate-y-[50%] left-[33%] w-2 h-2 rounded-full bg-[#3552DC] outline outline-[#3552DC] outline-offset-2 cursor-pointer"
        />
        <div
          onClick={() => handleChangeCurrentPage('payment')}
          className="absolute top-50% -translate-y-[50%] left-[66%] w-2 h-2 rounded-full bg-[#3552DC] outline outline-[#3552DC] outline-offset-2 cursor-pointer"
        />
        <div
          onClick={() => handleChangeCurrentPage('review')}
          className="absolute top-50% -translate-y-[50%] left-[100%] w-2 h-2 rounded-full bg-[#3552DC] outline outline-[#3552DC] outline-offset-2 cursor-pointer"
        />
        <div
          className={`absolute top-0 left-0 h-[2px] bg-[#3552DC]`}
          style={{ width: `${currPercentage}%` }}
        />
      </div>
      <div className="flex items-center justify-between mt-5 font-opensans text-sm">
        <p className="-translate-x-7">Account</p>
        <p className="-translate-x-3">Shipping</p>
        <p className="translate-x-1">Payment</p>
        <p className="translate-x-8">Review</p>
      </div>
    </div>
  );
};

export default CheckoutLine;
