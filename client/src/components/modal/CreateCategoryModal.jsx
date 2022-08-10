import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import {
  createCategory,
  updateCategory,
} from './../../redux/slices/categorySlice';
import Loader from './../global/Loader';

const CreateCategoryModal = ({
  createCategoryRef,
  openCreateCategoryModal,
  setOpenCreateCategoryModal,
  updatedItem,
  setUpdatedItem,
}) => {
  const [categoryData, setCategoryData] = useState({
    name: '',
  });

  const [loading, setLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const handleCloseButton = () => {
    setOpenCreateCategoryModal(false);
    setUpdatedItem({ _id: '', name: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData({ ...categoryData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryData.name) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          errors: 'Please provide category name.',
        },
      });
    }

    setLoading(true);
    if (isUpdated) {
      await dispatch(
        updateCategory({
          data: { ...updatedItem, name: categoryData.name },
          token: `${auth.token}`,
        })
      );

      setUpdatedItem({ _id: '', name: '' });
      setIsUpdated(false);
    } else {
      await dispatch(
        createCategory({ data: categoryData, token: `${auth.token}` })
      );
    }
    setLoading(false);

    setOpenCreateCategoryModal(false);
    setCategoryData({ name: '' });
  };

  useEffect(() => {
    if (updatedItem._id) {
      setIsUpdated(true);
      setCategoryData({ name: updatedItem.name });
    }

    return () => {
      setIsUpdated(false);
      setCategoryData({ name: '' });
    };
  }, [updatedItem]);

  return (
    <div
      className={`${openCreateCategoryModal ? 'opacity-100' : 'opacity-0'} ${
        openCreateCategoryModal ? 'pointer-events-auto' : 'pointer-events-none'
      } transition-opacity fixed top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,.7)] z-[9999] flex justify-center items-center px-5 font-opensans`}
    >
      <div
        ref={createCategoryRef}
        className={`${
          openCreateCategoryModal ? 'translate-y-0' : '-translate-y-12'
        } transition-transform w-full max-w-[500px] bg-white rounded-md`}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b boder-gray-300">
          <h1 className="text-lg">
            {isUpdated ? (
              <span className="text-green-600">Update Category</span>
            ) : (
              <span className="text-orange-600">Create Category</span>
            )}
          </h1>
          <AiOutlineClose
            onClick={handleCloseButton}
            className="cursor-pointer"
          />
        </div>
        <div className="px-5 py-3 overflow-auto hide-scrollbar">
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="text-sm">
                Name
              </label>
              <input
                type="text"
                autoComplete="off"
                id="name"
                name="name"
                value={categoryData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 outline-0 mt-2 rounded-md text-sm"
              />
            </div>
            <button
              className={`text-sm ${loading ? 'bg-blue-300' : 'bg-blue-500'} ${
                loading ? 'bg-blue-300' : 'hover:bg-blue-600'
              } ${
                loading ? 'cursor-auto' : 'cursor-pointer'
              } transition-[background] rounded-md float-right text-white px-5 py-2 my-5`}
            >
              {loading ? <Loader /> : isUpdated ? 'Save Changes' : 'Save'}
            </button>
            <div className="clear-both" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCategoryModal;
