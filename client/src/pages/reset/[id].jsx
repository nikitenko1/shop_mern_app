import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Loader from '../../components/global/Loader';
import { patchDataAPI } from '../../utils/fetchData';
import Footer from './../../components/global/Footer';
import HeadInfo from '../../utils/HeadInfo';

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    newPasswordConfirmation: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordData.newPassword || !passwordData.newPasswordConfirmation) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: "Please provide new password and it's confirmation.",
        },
      });
    }

    if (passwordData.newPassword.length < 8) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'Password should be at least 8 characters.',
        },
      });
    }

    if (passwordData.newPassword !== passwordData.newPasswordConfirmation) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'Password confirmation should be matched.',
        },
      });
    }

    setLoading(true);
    try {
      const res = await patchDataAPI(`auth/reset/${id}`, {
        password: passwordData.newPassword,
      });
      dispatch({
        type: 'alert/alert',
        payload: {
          success: res.data.msg,
        },
      });
    } catch (err) {
      dispatch({
        type: 'alert/alert',
        payload: {
          error: err.response.data.msg,
        },
      });
    }
    setLoading(false);
    navigate('/');
  };

  return (
    <>
      <HeadInfo title="Reset Password" />
      <div className="bg-gray-800 text-white px-7 py-4 drop-shadow-md sticky top-0 z-[999]">
        <h1 className="font-opensans font-medium text-center">
          Let's work || Reset Password
        </h1>
      </div>
      <div className="font-opensans my-20 w-full max-w-[500px] m-auto">
        <h1 className="text-center font-medium mb-8 text-xl">Reset Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="mt-5">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handleChange}
              className="border border-gray-300 outline-0 rounded-md p-2 text-sm w-full mt-3"
            />
          </div>
          <div className="mt-5">
            <label htmlFor="newPasswordConfirmation">
              New Password Confirmation
            </label>
            <input
              type="password"
              name="newPasswordConfirmation"
              id="newPasswordConfirmation"
              value={passwordData.newPasswordConfirmation}
              onChange={handleChange}
              className="border border-gray-300 outline-0 rounded-md p-2 text-sm w-full mt-3"
            />
          </div>
          <button
            type="submit"
            disabled={loading ? true : false}
            className={`${
              loading
                ? 'bg-blue-200 hover:bg-blue-200 cursor-auto'
                : 'bg-blue-400 hover:bg-blue-600 cursor-pointer'
            } text-white text-sm px-4 py-2 rounded-md mt-6 transition-[background]`}
          >
            {loading ? <Loader /> : 'Reset'}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default ResetPassword;
