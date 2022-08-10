import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Layout from './../components/admin/Layout';
import Loader from './../components/global/Loader';
import HeadInfo from '../utils/HeadInfo';
import {
  deleteSubscriber,
  getSubscriber,
} from './../redux/slices/subscriberSlice';
import NotFound from '../components/global/NotFound';
import DeleteModal from '../components/modal/DeleteModal';

const Subscriber = () => {
  const [currPage, setCurrPage] = useState(1);
  const [subscribers, setSubscribers] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState('');

  const deleteModalRef = useRef();

  const dispatch = useDispatch();

  const { auth, alert, subscriber } = useSelector((state) => state);

  useEffect(() => {
    dispatch(getSubscriber({ token: `${auth.token}`, page: currPage }));
  }, [dispatch, auth.token, currPage]);

  useEffect(() => {
    setSubscribers(subscriber.data);
  }, [subscriber]);

  const handleClickDelete = (id) => {
    setSelectedId(id);
    setOpenDeleteModal(true);
  };

  const handleDeleteSubscriber = () => {
    dispatch(deleteSubscriber({ id: selectedId, token: `${auth.token}` }));
    setOpenDeleteModal(false);
  };

  const handlePaginationArrow = (type) => {
    let newPage = 0;

    if (type === 'prev') {
      newPage = currPage - 1;
      if (newPage < 1) {
        newPage = 1;
      }
    } else if (type === 'next') {
      newPage = currPage + 1;
      if (newPage > subscriber.totalPage) {
        newPage = subscriber.totalPage;
      }
    }

    setCurrPage(newPage);
  };

  if (auth.user?.role !== 'admin') {
    return <NotFound />;
  }
  return (
    <>
      <HeadInfo title="Subscriber Management" />
      <Layout>
        <>
          <h1 className="text-2xl tracking-wide font-oswald">
            Subscriber Management
          </h1>
          {alert.loading ? (
            <Loader size="xl" />
          ) : (
            <div className="overflow-x-auto mt-8">
              <table className="w-full">
                <thead>
                  <tr className="text-sm bg-[#3552DC] text-white">
                    <th className="p-3">No</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((item, idx) => (
                    <tr
                      key={item._id}
                      className="text-sm text-center bg-gray-100"
                    >
                      <td className="p-3">{idx + 1}</td>
                      <td>{item.email}</td>
                      <td>
                        <button
                          onClick={() => handleClickDelete(item._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition-[background]"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {subscriber.totalPage > 1 && (
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

                    {Array.from(Array(subscriber.totalPage).keys()).map(
                      (_, idx) => (
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
                      )
                    )}

                    {currPage < subscriber.totalPage && (
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
      <DeleteModal
        deleteModalRef={deleteModalRef}
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
        success={handleDeleteSubscriber}
      />
    </>
  );
};

export default Subscriber;
