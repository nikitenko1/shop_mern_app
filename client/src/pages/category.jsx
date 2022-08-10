import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from './../components/admin/Layout';
import DeleteModal from './../components/modal/DeleteModal';
import CreateCategoryModal from './../components/modal/CreateCategoryModal';
import Loader from './../components/global/Loader';
import NotFound from './../components/global/NotFound';
import HeadInfo from '../utils/HeadInfo';
import {
  deleteCategory,
  getAdminCategory,
} from './../redux/slices/categorySlice';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [openCreateCategoryModal, setOpenCreateCategoryModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [updatedItem, setUpdatedItem] = useState({ _id: '', name: '' });
  const [currPage, setCurrPage] = useState(1);

  const deleteModalRef = useRef();
  const createCategoryRef = useRef();

  const dispatch = useDispatch();
  const { auth, category, alert } = useSelector((state) => state);

  const handleUpdateButtonClicked = (item) => {
    setOpenCreateCategoryModal(true);
    setUpdatedItem(item);
  };

  const handleDeleteButtonClicked = (id) => {
    setOpenDeleteModal(true);
    setSelectedId(id);
  };

  const handleDeleteCategory = async () => {
    await dispatch(deleteCategory({ id: selectedId, token: `${auth.token}` }));
    setOpenDeleteModal(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openCreateCategoryModal &&
        createCategoryRef.current &&
        !createCategoryRef.current.contains(e.target)
      ) {
        setOpenCreateCategoryModal(false);
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
  }, [openCreateCategoryModal, setOpenCreateCategoryModal]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openDeleteModal &&
        deleteModalRef.current &&
        !deleteModalRef.current.contains(e.target)
      ) {
        setOpenDeleteModal(false);
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
  }, [openDeleteModal, setOpenDeleteModal]);

  const handlePaginationArrow = (type) => {
    let newPage = 0;

    if (type === 'prev') {
      newPage = currPage - 1;
      if (newPage < 1) {
        newPage = 1;
      }
    } else if (type === 'next') {
      newPage = currPage + 1;
      if (newPage > category.totalPage) {
        newPage = category.totalPage;
      }
    }

    setCurrPage(newPage);
  };

  useEffect(() => {
    dispatch(
      getAdminCategory({ token: `${auth.token}`, page: currPage, limit: 8 })
    );
  }, [dispatch, auth.token, currPage]);

  useEffect(() => {
    setCategories(category.data);
  }, [category.data]);

  if (auth.user?.role !== 'admin') {
    return <NotFound />;
  }

  return (
    <>
      <HeadInfo title="Category Management" />
      <Layout>
        <>
          <div className="flex items-center justify-between gap-10">
            <h1 className="text-2xl tracking-wide font-oswald">
              Category Management
            </h1>
            <button
              onClick={() => setOpenCreateCategoryModal(true)}
              className="bg-blue-500 rounded-full px-5 py-2 hover:bg-blue-600 transition-[background] text-sm text-white"
            >
              Create Category
            </button>
          </div>
          {alert.loading ? (
            <Loader size="xl" />
          ) : (
            <div className="overflow-x-auto mt-8">
              <table className="w-full">
                <thead>
                  <tr className="text-sm bg-[#3552DC] text-white">
                    <th className="p-3">No</th>
                    <th>Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((item, idx) => (
                    <tr
                      className="text-sm text-center bg-gray-100"
                      key={item._id}
                    >
                      <td className="p-3">{idx + 1}</td>
                      <td>{item.name}</td>
                      <td>
                        <button
                          onClick={() => handleUpdateButtonClicked(item)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded-full hover:bg-yellow-600 transition-[background] mr-3"
                        >
                          Update
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteButtonClicked(`${item._id}`)
                          }
                          className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition-[background]"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {category.totalPage > 1 && (
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

                    {Array.from(Array(category.totalPage).keys()).map(
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

                    {currPage < category.totalPage && (
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
        success={handleDeleteCategory}
      />

      <CreateCategoryModal
        createCategoryRef={createCategoryRef}
        openCreateCategoryModal={openCreateCategoryModal}
        setOpenCreateCategoryModal={setOpenCreateCategoryModal}
        updatedItem={updatedItem}
        setUpdatedItem={setUpdatedItem}
      />
    </>
  );
};

export default Category;
