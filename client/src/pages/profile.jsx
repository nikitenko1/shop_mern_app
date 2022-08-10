import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HeadInfo from '../utils/HeadInfo';
import Navbar from '../components/global/Navbar';
import Header from '../components/home/Header';
import Footer from '../components/global/Footer';
import Loader from '../components/global/Loader';
import { useNavigate } from 'react-router-dom';
import { editProfile } from '../redux/slices/authSlice';

const Profile = () => {
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
  });
  const [avatar, setAvatar] = useState();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
  };

  const { auth } = useSelector((state) => state);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData.name)
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Please fill up your name.' },
      });

    if (!userData.phone)
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Please fill up your phone number.' },
      });
    setLoading(true);
    await dispatch(editProfile({ userData, avatar, token: `${auth.token}` }));
    setLoading(false);
    setUserData({
      name: '',
      phone: '',
    });
    navigate('/');
  };

  useEffect(() => {
    if (auth.user) {
      setUserData({
        name: auth.user?.name,
        phone: auth.user?.phone,
      });
    }
  }, [auth.user]);
  return (
    <>
      <HeadInfo title="Profile" />
      <Navbar />
      <Header />
      <div className="m-auto bg-white md:w-8/12 w-10/12 drop-shadow-2xl -translate-y-10 p-5 font-opensans">
        <div className="mb-8">
          <h1 className="text-xl">
            Edit <span className="text-green-500">Profile</span>
          </h1>
          <form onSubmit={(e) => handleSubmit(e, 'profile')}>
            <div className="mt-4">
              <label htmlFor="email" className="text-sm">
                Email Auth User
              </label>
              <input
                type="text"
                disabled
                defaultValue={auth.user?.email}
                className="w-full border border-gray-300 rounded-md p-2 text-sm mt-2 outline-0 bg-gray-100"
              />
            </div>

            <div className="flex gap-5 my-5">
              <div className="w-32 h-32 rounded-full outline outline-2 outline-gray-300 outline-offset-2 shrink-0">
                <img
                  src={avatar ? URL.createObjectURL(avatar) : auth.user?.avatar}
                  alt={auth.user?.name}
                  className="object-cover w-full h-full rounded-full"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                className="flex-3 border rounded-md outline-0"
                onChange={handleChangeImage}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="border border-gray-400 rounded-md w-full h-9 mt-2 outline-0 px-2"
                autoComplete="off"
                value={userData.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="name">Phone</label>
              <input
                type="text"
                id="phone"
                name="phone"
                className="border border-gray-400 rounded-md w-full h-9 mt-2 outline-0 px-2"
                autoComplete="off"
                value={userData.phone}
                onChange={handleChange}
              />
            </div>
            <button
              className={`${
                loading
                  ? 'bg-gray-200 hover:bg-gray-400 cursor-auto'
                  : 'bg-blue-400 hover:bg-blue-600 cursor-pointer'
              } transition-[background] mt-2 text-sm text-white w-1/2 rounded-md py-3`}
            >
              {loading ? <Loader /> : 'Save Changes'}
            </button>
            <div className="clear-both" />
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
