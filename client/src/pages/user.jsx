import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserDetailModal from '../components/modal/UserDetailModal';
import { getAllUser } from '../redux/slices/userSlice';
import HeadInfo from '../utils/HeadInfo';
import Layout from './../components/admin/Layout';
import Loader from '../components/global/Loader';
import NotFound from './../components/global/NotFound';

const User = () => {
  const [currPage, setCurrPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [openUserDetailModal, setOpenUserDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState();

  const dispatch = useDispatch();
  const { auth, alert, user } = useSelector((state) => state);

  const userDetailModalRef = useRef();

  const handleClickDetail = (item) => {
    setOpenUserDetailModal(true);
    setSelectedItem(item);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openUserDetailModal &&
        userDetailModalRef.current &&
        !userDetailModalRef.current.contains(e.target)
      ) {
        setOpenUserDetailModal(false);
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
  }, [openUserDetailModal, setOpenUserDetailModal]);

  const handlePaginationArrow = (type) => {
    let newPage = 0;

    if (type === 'prev') {
      newPage = currPage - 1;
      if (newPage < 1) {
        newPage = 1;
      }
    } else if (type === 'next') {
      newPage = currPage + 1;
      if (newPage > user.totalPage) {
        newPage = user.totalPage;
      }
    }

    setCurrPage(newPage);
  };

  useEffect(() => {
    dispatch(getAllUser({ token: `${auth.token}`, page: currPage }));
  }, [dispatch, auth.token, currPage]);

  useEffect(() => {
    setUsers(user.data);
  }, [user.data]);

  if (auth.user?.role !== 'admin') {
    return <NotFound />;
  }

  return (
    <>
      <HeadInfo title="User Management" />
      <Layout>
        <>
          <h1 className="text-2xl tracking-wide font-oswald">
            User Management
          </h1>
          {alert.loading ? (
            <Loader size="xl" />
          ) : (
            <div className="overflow-x-auto mt-8">
              <table className="w-full">
                <thead>
                  <tr className="text-sm bg-[#3552DC] text-white">
                    <th className="p-3">No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((item, idx) => (
                    <tr
                      key={item._id}
                      className="text-sm text-center bg-gray-100"
                    >
                      <td className="p-3">{idx + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.phone ? item.phone : 'Not Set'}</td>
                      <td>{item.address ? item.address : 'Not Set'}</td>
                      <td>
                        <button
                          onClick={() => handleClickDetail(item)}
                          className="bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition-[background]"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {user.totalPage > 1 && (
                <>
                  <div className="flex mt-6 border border-gray-300 rounded-md w-fit float-right">
                    {currPage > 1 && (
                      <div
                        onClick={() => handlePaginationArrow('prev')}
                        className="cursor-pointer py-2 px-4 border-r border-gray-300"
                      >
                        &lt;
                      </div>
                    )}

                    {Array.from(Array(user.totalPage).keys()).map((_, idx) => (
                      <div
                        key={idx}
                        onClick={() => setCurrPage(idx + 1)}
                        className={`cursor-pointer py-2 px-4 border-r border-gray-300 ${
                          currPage === idx + 1
                            ? 'bg-[#3552DC] text-white'
                            : undefined
                        }`}
                      >
                        {idx + 1}
                      </div>
                    ))}

                    {currPage < user.totalPage && (
                      <div
                        onClick={() => handlePaginationArrow('next')}
                        className="cursor-pointer py-2 px-4"
                      >
                        &gt;
                      </div>
                    )}
                  </div>
                  <div className="clear-both" />
                </>
              )}
            </div>
          )}
        </>
      </Layout>
      {selectedItem && (
        <UserDetailModal
          openUserDetailModal={openUserDetailModal}
          setOpenUserDetailModal={setOpenUserDetailModal}
          userDetailModalRef={userDetailModalRef}
          selectedItem={selectedItem}
        />
      )}
    </>
  );
};

export default User;
