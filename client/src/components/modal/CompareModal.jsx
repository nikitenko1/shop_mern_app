import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';
import { numberFormatter } from '../../utils/numberFormatter';
import { getDataAPI } from '../../utils/fetchData';
import { getProduct } from '../../redux/slices/productSlice';

const CompareModal = ({ compareRef }) => {
  const [productInput, setProductInput] = useState({
    leftProduct: '',
    rightProduct: '',
  });

  const [leftProduct, setLeftProduct] = useState();
  const [rightProduct, setRightProduct] = useState();

  const [currLeftProductImage, setCurrLeftProductImage] = useState('');
  const [currRightProductImage, setCurrRightProductImage] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { compare, product } = useSelector((state) => state);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductInput({ ...productInput, [name]: value });
  };

  const handleClickDetail = (id) => {
    navigate(`/product/${id}`);
    dispatch({ type: 'compare/open', payload: false });
  };

  useEffect(() => {
    dispatch(getProduct({ page: 1, limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (compare.isOpen && Object.keys(compare.data).length > 0) {
      setLeftProduct(compare.data);
      setProductInput({ leftProduct: `${compare.data._id}`, rightProduct: '' });
    }
  }, [compare.data, compare.isOpen]);

  useEffect(() => {
    if (productInput.leftProduct) {
      getDataAPI(`product/${productInput.leftProduct}`).then((res) => {
        setLeftProduct(res.data.product);
      });
    }

    return () => setLeftProduct(undefined);
  }, [productInput.leftProduct]);

  useEffect(() => {
    if (productInput.rightProduct) {
      getDataAPI(`product/${productInput.rightProduct}`).then((res) => {
        setRightProduct(res.data.product);
      });
    }

    return () => setRightProduct(undefined);
  }, [productInput.rightProduct]);

  useEffect(() => {
    if (leftProduct?.images) {
      setCurrLeftProductImage(leftProduct.images[0]);
    }

    return () => setCurrLeftProductImage('');
  }, [leftProduct]);

  useEffect(() => {
    if (rightProduct?.images) {
      setCurrRightProductImage(rightProduct.images[0]);
    }

    return () => setCurrRightProductImage('');
  }, [rightProduct]);

  return (
    <div
      className={`${compare.isOpen ? 'opacity-100' : 'opacity-0'} ${
        compare.isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      } transition-opacity fixed top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,.7)] z-[9999] flex justify-center items-center px-5 font-opensans`}
    >
      <div
        ref={compareRef}
        className={`${
          compare.isOpen ? 'translate-y-0' : '-translate-y-12'
        } transition-transform w-full max-w-[800px] bg-white rounded-md`}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b boder-gray-300">
          <h1 className="text-lg">Compare Products</h1>
          <AiOutlineClose
            onClick={() => dispatch({ type: 'compare/open', payload: false })}
            className="cursor-pointer"
          />
        </div>
        <div className="p-5 flex gap-16 h-[500px] overflow-auto hide-scrollbar mb-5">
          <div className="flex-1">
            <label htmlFor="leftProduct" className="text-sm">
              Product
            </label>
            <select
              value={productInput.leftProduct}
              onChange={handleChange}
              name="leftProduct"
              id="leftProduct"
              className="w-full border border-gray-300 rounded-md bg-white p-2 text-sm mt-2 outline-0"
            >
              <option value="">- Select Product -</option>
              {product.data.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
            {leftProduct && (
              <div className="mt-5">
                <div>
                  <div className="border border-gray-300 p-4">
                    <img src={currLeftProductImage} alt={leftProduct.name} />
                  </div>
                </div>
                <div className="mt-5">
                  <div className="flex items-center gap-4">
                    <h1 className="font-oswald text-2xl">{leftProduct.name}</h1>
                    {leftProduct.discount !== 0 && (
                      <p className="text-xs bg-black text-white rounded-md p-2">
                        -{leftProduct.discount}%
                      </p>
                    )}
                  </div>
                  <div className="flex items-center mt-4 gap-6">
                    <p className="font-bold">
                      {numberFormatter(
                        leftProduct.price -
                          (leftProduct.discount * leftProduct.price) / 100
                      )}
                      ,00
                    </p>
                    {leftProduct.discount !== 0 && (
                      <p className="text-gray-400 line-through text-sm">
                        {numberFormatter(leftProduct.price)},00
                      </p>
                    )}
                  </div>
                  <p className="text-sm mt-3">{leftProduct.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <p>Sizes: </p>
                    {leftProduct.sizes.map((item) => (
                      <p
                        key={item}
                        className="bg-gray-200 p-2 rounded-md text-xs w-fit"
                      >
                        {item}
                      </p>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mt-5">
                    <p>Colors: </p>
                    {leftProduct.colors.map((item) => (
                      <div
                        key={item}
                        className="w-6 h-6 rounded-full"
                        style={{ background: item }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => handleClickDetail(`${leftProduct._id}`)}
                    className="bg-blue-500 hover:bg-blue-600 transition-[background] rounded-md text-white px-3 py-2 text-sm mt-5"
                  >
                    View Detail
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="flex-1">
            <label htmlFor="rightProduct" className="text-sm">
              Product
            </label>
            <select
              value={productInput.rightProduct}
              onChange={handleChange}
              name="rightProduct"
              id="rightProduct"
              className="w-full border border-gray-300 rounded-md bg-white p-2 text-sm mt-2 outline-0"
            >
              <option value="">- Select Product -</option>
              {product.data.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
            {rightProduct && (
              <div className="mt-5">
                <div>
                  <div className="border border-gray-300 p-4">
                    <img src={currRightProductImage} alt={rightProduct.name} />
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    {rightProduct.images.map((item) => (
                      <div
                        key={item}
                        onClick={() => setCurrRightProductImage(item)}
                        className="w-16 h-16 border border-gray-300 flex items-center justify-between p-1 cursor-pointer"
                      >
                        <img src={item} alt={rightProduct.name} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-5">
                  <div className="flex items-center gap-4">
                    <h1 className="font-oswald text-2xl">
                      {rightProduct.name}
                    </h1>
                    {rightProduct.discount !== 0 && (
                      <p className="text-xs bg-black text-white rounded-md p-2">
                        -{rightProduct.discount}%
                      </p>
                    )}
                  </div>
                  <div className="flex items-center mt-4 gap-6">
                    <p className="font-bold">
                      {numberFormatter(
                        rightProduct.price -
                          (rightProduct.discount * rightProduct.price) / 100
                      )}
                      ,00
                    </p>
                    {rightProduct.discount !== 0 && (
                      <p className="text-gray-400 line-through text-sm">
                        {numberFormatter(rightProduct.price)},00
                      </p>
                    )}
                  </div>
                  <p className="text-sm mt-3">{rightProduct.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <p>Sizes: </p>
                    {rightProduct.sizes.map((item) => (
                      <p
                        key={item}
                        className="bg-gray-200 p-2 rounded-md text-xs w-fit"
                      >
                        {item}
                      </p>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mt-5">
                    <p>Colors: </p>
                    {rightProduct.colors.map((item) => (
                      <div
                        key={item}
                        className="w-6 h-6 rounded-full"
                        style={{ background: item }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => handleClickDetail(`${rightProduct._id}`)}
                    className="bg-blue-500 hover:bg-blue-600 transition-[background] rounded-md text-white px-3 py-2 text-sm mt-5"
                  >
                    View Detail
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareModal;
