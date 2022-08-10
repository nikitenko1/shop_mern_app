import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, getProduct } from './../../redux/slices/productSlice';
import Layout from './../../components/admin/Layout';
import DeleteModal from './../../components/modal/DeleteModal';
import CreateProductModal from './../../components/modal/CreateProductModal';
import Loader from './../../components/global/Loader';
import NotFound from './../../components/global/NotFound';
import HeadInfo from '../../utils/HeadInfo';

const Product = () => {
  const [currPage, setCurrPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [openCreateProductModal, setOpenCreateProductModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [updatedItem, setUpdatedItem] = useState({
    _id: '',
    name: '',
    brand: '',
    category: '',
    colors: [],
    sizes: [],
    price: 0,
    discount: 0,
    description: '',
    images: [],
    stock: [],
    weight: 0,
  });

  const createProductRef = useRef();
  const deleteModalRef = useRef();

  const dispatch = useDispatch();
  const { auth, product, alert } = useSelector((state) => state);

  const handlePaginationArrow = (type) => {
    let newPage = 0;

    if (type === 'prev') {
      newPage = currPage - 1;
      if (newPage < 1) {
        newPage = 1;
      }
    } else if (type === 'next') {
      newPage = currPage + 1;
      if (newPage > product.totalPage) {
        newPage = product.totalPage;
      }
    }

    setCurrPage(newPage);
  };

  const handleDeleteButtonClicked = (id) => {
    setOpenDeleteModal(true);
    setSelectedId(id);
  };

  const handleDeleteProduct = async () => {
    await dispatch(deleteProduct({ id: selectedId, token: `${auth.token}` }));
    setOpenDeleteModal(false);
  };

  const handleUpdateButtonClicked = (item) => {
    setOpenCreateProductModal(true);
    setUpdatedItem(item);
  };

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        openCreateProductModal &&
        createProductRef.current &&
        !createProductRef.current.contains(e.target)
      ) {
        setOpenCreateProductModal(false);
        setUpdatedItem({
          _id: '',
          name: '',
          brand: '',
          category: '',
          colors: [],
          sizes: [],
          price: 0,
          discount: 0,
          description: '',
          images: [],
          stock: [],
          weight: 0,
        });
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);
    return () =>
      document.removeEventListener('mousedown', checkIfClickedOutside);
  }, [openCreateProductModal]);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        openDeleteModal &&
        deleteModalRef.current &&
        !deleteModalRef.current.contains(e.target)
      ) {
        setOpenDeleteModal(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);
    return () =>
      document.removeEventListener('mousedown', checkIfClickedOutside);
  }, [openDeleteModal]);

  useEffect(() => {
    dispatch(getProduct({ page: currPage, limit: 8 }));
  }, [dispatch, currPage]);

  useEffect(() => {
    setProducts(product.data);
  }, [product.data]);

  if (auth.user?.role !== 'admin') {
    return <NotFound />;
  }

  return (
    <>
      <HeadInfo title="Product Management" />
      <Layout>
        <>
          <div className="flex items-center justify-between gap-10">
            <h1 className="text-2xl tracking-wide font-oswald">
              Product Management
            </h1>
            <button
              onClick={() => setOpenCreateProductModal(true)}
              className="bg-blue-500 rounded-full px-5 py-2 hover:bg-blue-600 transition-[background] text-sm text-white"
            >
              Create Product
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
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Discount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item, idx) => (
                    <tr
                      key={item._id}
                      className="text-sm text-center bg-gray-100"
                    >
                      <td className="p-3">{idx + 1}</td>
                      <td>{item.name}</td>
                      <td>
                        {typeof item.brand === 'string'
                          ? item.brand
                          : item.brand.name}
                      </td>
                      <td>
                        {typeof item.category === 'string'
                          ? item.category
                          : item.category.name}
                      </td>
                      <td>USD{item.price}</td>
                      <td>{item.discount}%</td>
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

              {product.totalPage > 1 && (
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

                    {Array.from(Array(product.totalPage).keys()).map(
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

                    {currPage < product.totalPage && (
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

      <CreateProductModal
        createProductRef={createProductRef}
        openCreateProductModal={openCreateProductModal}
        setOpenCreateProductModal={setOpenCreateProductModal}
        updatedItem={updatedItem}
        setUpdatedItem={setUpdatedItem}
      />

      <DeleteModal
        deleteModalRef={deleteModalRef}
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
        success={handleDeleteProduct}
      />
    </>
  );
};

export default Product;
