import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRecipient } from '../../redux/slices/recipientSlice';

const Account = ({ setCurrPage }) => {
  const [accountData, setAccountData] = useState({
    recipientName: '',
    recipientPhone: '',
    recipientEmail: '',
  });

  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccountData({ ...accountData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !accountData.recipientName ||
      !accountData.recipientPhone ||
      !accountData.recipientEmail
    ) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'Please provide all field.',
        },
      });
    }

    dispatch(setRecipient(accountData));
    setCurrPage('shipping');
  };

  useEffect(() => {
    if (auth.user) {
      const tempAccountData = JSON.parse(
        localStorage.getItem('learnify_recipient')
      );
      if (tempAccountData) {
        setAccountData(tempAccountData);
      } else {
        setAccountData({
          recipientName: auth.user.name,
          recipientPhone: auth.user.phone,
          recipientEmail: auth.user.email,
        });
      }
    }

    return () =>
      setAccountData({
        recipientName: '',
        recipientPhone: '',
        recipientEmail: '',
      });
  }, [auth.user]);

  return (
    <div className="mt-8 font-opensans">
      <h1 className="text-2xl mb-6">Account</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="recipientName" className="text-gray-500">
            Recipient Name
          </label>
          <input
            type="text"
            id="recipientName"
            autoComplete="off"
            name="recipientName"
            value={accountData.recipientName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md outline-0 p-2 text-sm mt-3"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="recipientPhone" className="text-gray-500">
            Recipient Phone Number
          </label>
          <input
            type="text"
            autoComplete="off"
            id="recipientPhone"
            name="recipientPhone"
            value={accountData.recipientPhone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md outline-0 p-2 text-sm mt-3"
          />
        </div>
        <div className="mb-8">
          <label htmlFor="recipientEmail" className="text-gray-500">
            Recipient Email Address
          </label>
          <input
            type="text"
            autoComplete="off"
            id="recipientEmail"
            name="recipientEmail"
            value={accountData.recipientEmail}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md outline-0 p-2 text-sm mt-3"
          />
        </div>
        <button
          disabled={
            !accountData.recipientName ||
            !accountData.recipientEmail ||
            !accountData.recipientPhone
              ? true
              : false
          }
          className={`${
            !accountData.recipientName ||
            !accountData.recipientEmail ||
            !accountData.recipientPhone
              ? 'bg-blue-300'
              : 'bg-[#3552DC]'
          } ${
            !accountData.recipientName ||
            !accountData.recipientEmail ||
            !accountData.recipientPhone
              ? 'hove:bg-blue-300'
              : 'hover:bg-[#122DB0]'
          } transition-[background] rounded-md text-sm text-white px-7 py-2`}
        >
          Proceed to Shipping
        </button>
      </form>
    </div>
  );
};

export default Account;
