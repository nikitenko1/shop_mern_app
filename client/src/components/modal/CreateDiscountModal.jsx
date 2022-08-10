import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import {
  createDiscount,
  updateDiscount,
} from '../../redux/slices/discountSlice';
import Loader from '../global/Loader';

const CreateDiscountModal = ({
  createDiscountRef,
  openCreateDiscountModal,
  setOpenCreateDiscountModal,
  updatedItem,
  setUpdatedItem,
}) => {
  const [discountData, setDiscountData] = useState({
    code: '',
    value: 0,
  });
  const [loading, setLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDiscountData({ ...discountData, [name]: value });
  };

  const handleCloseModal = () => {
    setOpenCreateDiscountModal(false);
    setUpdatedItem({ _id: '', code: '', value: 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!discountData.code || !discountData.value) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'Please provide discount code and value.',
        },
      });
    }

    if (discountData.code.length < 4) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'Discount code should be at least 4 characters.',
        },
      });
    }

    if (discountData.value < 1 || discountData.value > 100) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'Discount value should be in range of 1 and 100',
        },
      });
    }

    setLoading(true);
    if (isUpdated) {
      await dispatch(
        updateDiscount({
          data: {
            ...updatedItem,
            code: discountData.code,
            value: discountData.value,
          },
          token: `${auth.token}`,
        })
      );
      setIsUpdated(false);
      setUpdatedItem({ _id: '', code: '', value: 0 });
    } else {
      await dispatch(
        createDiscount({ data: discountData, token: `${auth.token}` })
      );
    }
    setLoading(false);
    setDiscountData({
      code: '',
      value: 0,
    });
    setOpenCreateDiscountModal(false);
  };

  useEffect(() => {
    if (updatedItem._id) {
      setIsUpdated(true);
      setDiscountData({
        code: updatedItem.code,
        value: updatedItem.value,
      });
    }

    return () => {
      setIsUpdated(false);
      setDiscountData({
        code: '',
        value: 0,
      });
    };
  }, [updatedItem]);

  return (
    <div
      className={`${openCreateDiscountModal ? 'opacity-100' : 'opacity-0'} ${
        openCreateDiscountModal ? 'pointer-events-auto' : 'pointer-events-none'
      } transition-opacity fixed top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,.7)] z-[9999] flex justify-center items-center px-5 font-opensans`}
    >
      <div
        ref={createDiscountRef}
        className={`${
          openCreateDiscountModal ? 'translate-y-0' : '-translate-y-12'
        } transition-transform w-full max-w-[500px] bg-white rounded-md`}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b boder-gray-300">
          <h1 className="text-lg">
            {isUpdated ? (
              <span className="text-green-600">Update Discount</span>
            ) : (
              <span className="text-orange-600">Create Discount</span>
            )}
          </h1>
          <AiOutlineClose
            onClick={handleCloseModal}
            className="cursor-pointer"
          />
        </div>
        <div className="px-5 py-3 overflow-auto hide-scrollbar">
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="code" className="text-sm">
                Code
              </label>
              <input
                type="text"
                autoComplete="off"
                id="code"
                name="code"
                value={discountData.code}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 outline-0 mt-2 rounded-md text-sm"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="value" className="text-sm">
                Value
              </label>
              <input
                type="number"
                autoComplete="off"
                id="value"
                name="value"
                value={discountData.value}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 outline-0 mt-2 rounded-md text-sm"
              />
            </div>
            <button
              disabled={loading ? true : false}
              className={`text-sm ${loading ? 'bg-blue-300' : 'bg-blue-500'} ${
                loading ? 'hover:bg-blue-300' : 'hover:bg-blue-600'
              } ${
                loading ? 'cursor-auto' : 'cursor-pointer'
              } transition-[background] rounded-md float-right text-white px-5 py-2 my-5`}
            >
              {loading ? <Loader /> : 'Save'}
            </button>
            <div className="clear-both" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDiscountModal;
