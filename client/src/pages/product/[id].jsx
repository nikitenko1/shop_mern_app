import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { BsLink45Deg } from 'react-icons/bs';
import { getDataAPI } from './../../utils/fetchData';
import Header from './../../components/home/Header';
import Detail from './../../components/product/Detail';
import ReviewContainer from './../../components/product/ReviewContainer';
import QnaContainer from '../../components/product/QnaContainer';
import ProductCard from './../../components/global/ProductCard';
import Navbar from './../../components/global/Navbar';
import Subscribe from './../../components/global/Subscribe';
import Footer from './../../components/global/Footer';
import Loader from './../../components/global/Loader';
import HeadInfo from '../../utils/HeadInfo';

const ProductDetail = () => {
  const [currentOption, setCurrentOption] = useState('review');
  const [product, setProduct] = useState();
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { id } = useParams();
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getDataAPI(`product/${id}`)
      .then((res) => {
        setProduct(res.data.product);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response.data.msg);
        setLoading(false);
      });
    return () => setProduct(undefined);
  }, [id]);

  useEffect(() => {
    if (!product) return;

    getDataAPI(
      `product/similar/${product?._id}/${
        typeof product.category === 'string'
          ? product?.category
          : product?.category._id
      }`
    ).then((res) => {
      setSimilarProducts(res.data.products);
    });

    return () => setSimilarProducts([]);
  }, [product]);

  const { socket } = useSelector((state) => state);

  useEffect(() => {
    if (!product?._id || !socket) return;

    socket.emit('joinRoom', product?._id);
    return () => socket.emit('leaveRoom', product?._id);
  }, [product?._id, socket]);

  return (
    <>
      <HeadInfo title={`${product?.name}`} />
      <Navbar />
      <Header />
      {loading ? (
        <Loader size="xl" />
      ) : error ? (
        <div className="m-auto bg-white w-10/12 py-20 drop-shadow-2xl -translate-y-10 font-opensans">
          <div className="bg-red-500 rounded-md w-8/12 text-center m-auto">
            <p className="text-white p-4">Product Not Found</p>
          </div>
        </div>
      ) : (
        <div className="m-auto bg-white w-10/12 drop-shadow-2xl -translate-y-10 font-opensans">
          <Detail product={product} />
          <div className="flex gap-6 border-t border-gray-300 px-16 py-5">
            <div
              onClick={() => setCurrentOption('review')}
              className={`${
                currentOption === 'review'
                  ? 'text-[#3552DC] font-bold'
                  : undefined
              } text-xs tracking-wider hover:font-bold hover:text-[#3552DC] cursor-pointer`}
            >
              REVIEWS
            </div>

            <div
              onClick={() => setCurrentOption('qna')}
              className={`${
                currentOption === 'qna' ? 'text-[#3552DC] font-bold' : undefined
              } text-xs tracking-wider cursor-pointer hover:font-bold hover:text-[#3552DC]`}
            >
              QnA
            </div>
          </div>
          {currentOption === 'review' ? (
            <ReviewContainer id={`${id}`} />
          ) : (
            <QnaContainer id={`${id}`} />
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-gray-300">
            <div className="border-b border-r border-gray-300 bg-[#161616] flex items-center justify-center flex-col gap-4 py-10 md:py-0">
              <BsLink45Deg className="text-blue-700 text-8xl" />
              <p className="font-oswald text-white font-bold text-2xl">
                SIMILAR PRODUCTS
              </p>
              <p className="text-gray-400 text-sm">
                Similar products that you might like
              </p>
            </div>
            {similarProducts.length > 0 && (
              <>
                {similarProducts.map((item) => (
                  <ProductCard key={item._id} view="grid" product={item} />
                ))}
              </>
            )}
          </div>
        </div>
      )}
      <Subscribe />
      <Footer />
    </>
  );
};

export default ProductDetail;
