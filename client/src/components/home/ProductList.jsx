import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getHomeCategory } from './../../redux/slices/homeCategorySlice';
import { getHomeProduct } from './../../redux/slices/homeProductSlice';
import { getBrand } from './../../redux/slices/brandSlice';
import HighlightedItem from './HighlightedItem';
import Filter from './Filter';
import ProductViewOption from './ProductViewOption';
import ProductCard from './../global/ProductCard';
import Pagination from './../global/Pagination';

const ProductList = () => {
  const [openFilter, setOpenFilter] = useState(false);
  const [products, setProducts] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);
  const [selectedColor, setSelectedColor] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState([]);
  const [selectedPage, setSelectedPage] = useState(1);

  const [sortBy, setSortBy] = useState('date');
  const [sortType, setSortType] = useState('desc');
  const [view, setView] = useState('grid');

  const filterRef = useRef();
  const dispatch = useDispatch();
  const {
    brand,
    homeProduct,
    homeCategory: category,
  } = useSelector((state) => state);

  useEffect(() => {
    setProducts(homeProduct.data.products);
  }, [homeProduct]);

  useEffect(() => {
    dispatch(
      getHomeProduct({
        selectedCategory,
        selectedBrand,
        selectedSize,
        selectedColor,
        selectedPrice,
        selectedPage,
        sortBy,
        sortType,
      })
    );
  }, [
    dispatch,
    selectedCategory,
    selectedBrand,
    selectedSize,
    selectedColor,
    selectedPrice,
    selectedPage,
    sortBy,
    sortType,
  ]);

  useEffect(() => {
    dispatch(getHomeCategory());
    dispatch(getBrand());
  }, [dispatch]);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        openFilter &&
        filterRef.current &&
        !filterRef.current.contains(e.target)
      ) {
        setOpenFilter(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);
    return () =>
      document.removeEventListener('mousedown', checkIfClickedOutside);
  }, [openFilter]);

  return (
    <div className="m-auto bg-white w-10/12 drop-shadow-2xl -translate-y-10">
      <HighlightedItem />
      <div className="flex relative">
        <Filter
          filterRef={filterRef}
          openFilter={openFilter}
          categories={category.data}
          brands={brand.data}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          setSelectedPrice={setSelectedPrice}
          setSelectedPage={setSelectedPage}
          setSortBy={setSortBy}
          setSortType={setSortType}
        />
        <div className="flex-[3]">
          <ProductViewOption
            openFilter={openFilter}
            setOpenFilter={setOpenFilter}
            setSortBy={setSortBy}
            setSortType={setSortType}
            setView={setView}
          />
          {products?.length === 0 ? (
            <div className="p-4">
              <p className="bg-red-500 rounded-md py-3 text-white text-center">
                No product found
              </p>
            </div>
          ) : (
            <div
              className={`grid grid-cols-1 ${
                view === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : undefined
              }`}
            >
              {products?.map((item) => (
                <ProductCard key={item._id} view={view} product={item} />
              ))}
            </div>
          )}

          {homeProduct.totalPage > 1 && (
            <div
              className={`${
                products.length !== 9 ? 'border-t border-gray-300' : undefined
              }`}
            >
              <Pagination
                selectedPage={selectedPage}
                setSelectedPage={setSelectedPage}
                totalPage={homeProduct.totalPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
