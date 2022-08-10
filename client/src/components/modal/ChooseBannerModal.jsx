import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateBanner } from '../../redux/slices/bannerSlice';
import { getDataAPI } from '../../utils/fetchData';
import { AiOutlineClose } from 'react-icons/ai';
import Loader from '../global/Loader';

const ChooseBannerModal = ({
  openChooseBannerModal,
  setOpenChooseBannerModal,
  chooseBannerModalRef,
  selectedBanner,
}) => {
  const [productList, setProductList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');

  const dispatch = useDispatch();
  const { alert, auth } = useSelector((state) => state);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error:
            'FE: Please select a product to be showcased at home page banner.',
        },
      });
    }

    await dispatch(
      updateBanner({
        data: [selectedBanner._id, selectedProduct],
        token: `${auth.token}`,
      })
    );

    setOpenChooseBannerModal(false);
  };

  useEffect(() => {
    getDataAPI('product/all').then((res) => {
      setProductList(res.data.products);
    });
  }, []);

  useEffect(() => {
    if (selectedBanner) {
      setSelectedProduct(`${selectedBanner.product._id}`);
    }
    return () => setSelectedProduct('');
  }, [selectedBanner]);

  return (
    <div
      className={`${openChooseBannerModal ? 'opacity-100' : 'opacity-0'} ${
        openChooseBannerModal ? 'pointer-events-auto' : 'pointer-events-none'
      } transition-opacity fixed top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,.7)] z-[9999] flex justify-center items-center px-5 font-opensans`}
    >
      <div
        ref={chooseBannerModalRef}
        className={`${
          openChooseBannerModal ? 'translate-y-0' : '-translate-y-12'
        } transition-transform w-full max-w-[500px] bg-white rounded-md`}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b boder-gray-300">
          <h1 className="text-lg">Choose Banner</h1>
          <AiOutlineClose
            onClick={() => setOpenChooseBannerModal(false)}
            className="cursor-pointer"
          />
        </div>
        <div className="p-5">
          <form onSubmit={handleSubmit}>
            <div>
              <label className="text-sm" htmlFor="product">
                Product
              </label>
              <select
                name="product"
                id="product"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 outline-none bg-transparent text-sm mt-3"
              >
                <option value="">- Choose Product -</option>
                {productList.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              disabled={alert.loading ? true : false}
              className={`${
                alert.loading
                  ? 'bg-blue-300 hover:bg-blue-300 cursor-auto'
                  : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
              } transition-[background] mt-4 rounded-md px-4 py-2 text-white text-sm float-right`}
            >
              {alert.loading ? <Loader /> : 'Save Changes'}
            </button>
            <div className="clear-both" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChooseBannerModal;
