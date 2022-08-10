import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './../../redux/slices/authSlice';
import { AiFillBell } from 'react-icons/ai';
import {
  getNotification,
  readNotification,
} from './../../redux/slices/notificationSlice';
import { BsPower } from 'react-icons/bs';
import HistoryModal from '../modal/HistoryModal';
import { getDataAPI } from '../../utils/fetchData';

const Navbar = () => {
  const [selectedItem, setSelectedItem] = useState();
  const [openNotificationDropdown, setOpenNotificationDropdown] =
    useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [totalNotification, setTotalNotification] = useState(0);

  const notificationDropdownRef = useRef();
  const detailModalRef = useRef();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth, notification } = useSelector((state) => state);

  const handleLogout = async () => {
    dispatch(logout({ token: `${auth.token}` }));
    navigate('/');
  };

  useEffect(() => {
    dispatch(getNotification({ token: `${auth.token}` }));
  }, [dispatch, auth.token]);

  useEffect(() => {
    if (notification.length > 0) {
      const countNotif = notification.filter((item) => item.isRead === false);
      setTotalNotification(countNotif.length);
    }

    return () => setTotalNotification(0);
  }, [notification]);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        openNotificationDropdown &&
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(e.target)
      ) {
        setOpenNotificationDropdown(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);
    return () =>
      document.removeEventListener('mousedown', checkIfClickedOutside);
  }, [openNotificationDropdown]);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        openDetailModal &&
        detailModalRef.current &&
        !detailModalRef.current.contains(e.target)
      ) {
        setOpenDetailModal(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);
    return () =>
      document.removeEventListener('mousedown', checkIfClickedOutside);
  }, [openDetailModal]);

  useEffect(() => {
    dispatch(getNotification({ token: `${auth.token}` }));
  }, [dispatch, auth.token]);

  useEffect(() => {
    if (notification.length > 0) {
      const countNotif = notification.filter((item) => item.isRead === false);
      setTotalNotification(countNotif.length);
    }

    return () => setTotalNotification(0);
  }, [notification]);

  const handleClickDetail = async (transactionId, notificationId) => {
    try {
      const res = await getDataAPI(`checkout/${transactionId}`, {
        token: `${auth.token}`,
      });
      setSelectedItem(res.data.transaction);
      setOpenDetailModal(true);
      dispatch(
        readNotification({ id: notificationId, token: `${auth.token}` })
      );
    } catch (err) {
      dispatch({
        type: 'alert/alert',
        payload: {
          errors: err.response.data.msg,
        },
      });
    }
  };
  return (
    <>
      <div className="flex items-center justify-end gap-8 text-lg py-1 bg-slate-50">
        <div className="text-sm flex items-center gap-4">
          <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center outline outline-2 outline-offset-2 outline-gray-200">
            <img
              src={auth.user?.avatar}
              alt={auth.user?.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <p>{auth.user?.email}</p>
        </div>
        <div ref={notificationDropdownRef} className="relative">
          <div className="relative">
            <AiFillBell
              onClick={() =>
                setOpenNotificationDropdown(!openNotificationDropdown)
              }
              className="cursor-pointer"
            />
            {totalNotification > 0 && (
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs p-2">
                {totalNotification}
              </div>
            )}
          </div>
          {notification.length !== 0 && (
            <div
              className={`absolute top-[100%] mt-4 transition-[background] border boder-gray-300 rounded-md shadow-xl w-[300px] right-0 bg-white ${
                openNotificationDropdown ? 'scale-y-1' : 'scale-y-0'
              } origin-top transition-[transform] max-h-[300px] overflow-auto hide-scrollbar`}
            >
              {notification.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleClickDetail(item.transaction, item._id)}
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-300 flex items-center gap-5"
                >
                  <p className="text-sm leading-loose">
                    <b>
                      {item.message.substring(0, item.message.indexOf('just'))}
                    </b>
                    {item.message.substring(
                      item.message.indexOf('just'),
                      item.message.length
                    )}
                  </p>
                  {!item.isRead && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <BsPower onClick={handleLogout} className="cursor-pointer mr-2" />
      </div>
      <HistoryModal
        modalRef={detailModalRef}
        openHistoryModal={openDetailModal}
        setOpenHistoryModal={setOpenDetailModal}
        selectedItem={selectedItem}
      />
    </>
  );
};

export default Navbar;
