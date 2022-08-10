import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineRefresh } from 'react-icons/hi';
import { BiChevronDown } from 'react-icons/bi';
import { numberFormatter } from './../../utils/numberFormatter';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import ColorTag from './../filter/ColorTag';
import SizeTag from './../filter/SizeTag';
import CategoryTag from './../filter/CategoryTag';
import 'rc-slider/assets/index.css';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const Filter = ({
  filterRef,
  openFilter,
  brands,
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  setSelectedPrice,
  setSelectedPage,
  setSortBy,
  setSortType,
}) => {
  const [price, setPrice] = useState([1, 1000]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  const { homeProduct, product } = useSelector((state) => state);

  const handleResetFilter = () => {
    setSelectedCategory('');
    setSelectedBrand([]);
    setSelectedSize([]);
    setSelectedColor([]);
    setSelectedPrice([]);
    setPrice([homeProduct.minPrice, homeProduct.maxPrice]);
    setSelectedPage(1);
    setSortBy('date');
    setSortType('desc');
  };

  const getSizeAndColor = useCallback(() => {
    const sizesTemp = [];
    const colorsTemp = [];

    product.data.forEach((item) => {
      item.sizes.forEach((sz) => {
        if (!sizesTemp.includes(sz)) {
          sizesTemp.push(sz);
        }
      });

      item.colors.forEach((clr) => {
        if (!colorsTemp.includes(clr)) colorsTemp.push(clr);
      });
    });

    setSizes(sizesTemp);
    setColors(colorsTemp);
  }, [product.data]);

  const handleClickCategory = (id) => {
    setSelectedPage(1);
    setSelectedCategory(id);
  };

  const handleChangeBrand = (e) => {
    setSelectedPage(1);
    let selectedBrandCopy = [...selectedBrand];
    if (!selectedBrandCopy.includes(e.target.value)) {
      selectedBrandCopy.push(e.target.value);
    } else {
      selectedBrandCopy = selectedBrandCopy.filter(
        (item) => item !== e.target.value
      );
    }
    setSelectedBrand(selectedBrandCopy);
  };

  const handleClickSize = (item) => {
    setSelectedPage(1);
    let selectedSizeCopy = [...selectedSize];
    if (!selectedSizeCopy.includes(item)) {
      selectedSizeCopy.push(item);
    } else {
      selectedSizeCopy = selectedSizeCopy.filter((sz) => sz !== item);
    }
    setSelectedSize(selectedSizeCopy);
  };

  const handleClickColor = (item) => {
    setSelectedPage(1);
    let selectedColorCopy = [...selectedColor];
    if (!selectedColorCopy.includes(item.substring(1, item.length))) {
      selectedColorCopy.push(item.substring(1, item.length));
    } else {
      selectedColorCopy = selectedColorCopy.filter(
        (sz) => sz !== item.substring(1, item.length)
      );
    }
    setSelectedColor(selectedColorCopy);
  };

  const handleSetPrice = () => {
    setSelectedPage(1);
    setSelectedPrice(price);
  };

  useEffect(() => {
    setPrice([homeProduct.minPrice, homeProduct.maxPrice]);
  }, [homeProduct.maxPrice, homeProduct.minPrice]);

  useEffect(() => {
    getSizeAndColor();
  }, [getSizeAndColor]);

  return (
    <div
      ref={filterRef}
      className={`absolute top-0 ${
        openFilter ? 'left-0' : '-left-[500px]'
      } w-[250px] drop-shadow-2xl bg-white lg:static lg:drop-shadow-none bottom-0 z-[999] flex-1 font-opensans border-l border-r border-b border-gray-300`}
    >
      <div className="flex items-center justify-between border-b border-gray-300">
        <p className="font-bold border-r border-gray-300 flex-1 px-4 py-3 text-sm">
          Filter
        </p>
        <div className="py-2 px-3 cursor-pointer" onClick={handleResetFilter}>
          <HiOutlineRefresh className="text-xl cursor-pointer text-blue-600" />
        </div>
      </div>
      <div className="border-b border-gray-300">
        <div className="flex items-center px-4 pt-4 pb-2">
          <BiChevronDown />
          <p className="text-xs font-bold tracking-widest ml-3">CATEGORIES</p>
        </div>
        {categories.map((item) => (
          <CategoryTag
            key={item.name}
            handleClickCategory={handleClickCategory}
            item={item}
            selectedCategory={selectedCategory}
          />
        ))}
      </div>
      <div className="border-b border-gray-300">
        <div className="flex items-center px-4 pt-4 pb-2">
          <BiChevronDown />
          <p className="text-xs font-bold tracking-widest ml-3">PRICE (USD)</p>
        </div>
        <div className="flex gap-4 pl-11 pr-3 w-full mt-2">
          <input
            type="text"
            disabled
            value={numberFormatter(price[0])}
            className="text-center text-sm w-[50%] h-9 border border-gray-300 bg-gray-100 rounded-md"
          />
          <input
            type="text"
            disabled
            value={numberFormatter(price[1])}
            className="text-center text-sm w-[50%] border border-gray-300 bg-gray-100 rounded-md"
          />
        </div>
        <div className="ml-11 mr-3 my-4">
          <Range
            min={homeProduct.minPrice}
            max={homeProduct.maxPrice}
            defaultValue={[homeProduct.minPrice, homeProduct.maxPrice]}
            tipFormatter={(value) => numberFormatter(value)}
            tipProps={{
              placement: 'top',
            }}
            value={price}
            onChange={(price) => setPrice(price)}
          />
          <button
            onClick={handleSetPrice}
            className="text-sm bg-blue-500 text-white rounded-md float-right mt-3 px-4 py-2 hover:bg-blue-600 transition-[background]"
          >
            Set Price
          </button>
          <div className="clear-both" />
        </div>
      </div>
      <div className="border-b border-gray-300">
        <div className="flex items-center px-4 pt-4 pb-2">
          <BiChevronDown />
          <p className="text-xs font-bold tracking-widest ml-3">BRANDS</p>
        </div>
        {brands.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between pl-11 pr-3 my-2"
          >
            <label htmlFor={item.name}>{item.name}</label>
            <input
              type="checkbox"
              checked={selectedBrand.includes(item._id) ? true : false}
              value={item._id}
              id={item.name}
              onChange={handleChangeBrand}
            />
          </div>
        ))}
      </div>
      <div className="border-b border-gray-300">
        <div className="flex items-center px-4 pt-4 pb-2">
          <BiChevronDown />
          <p className="text-xs font-bold tracking-widest ml-3">COLORS</p>
        </div>
        <div className="grid grid-cols-7 pl-11 pr-3 gap-4 mt-2 mb-4">
          {colors.map((item) => (
            <ColorTag
              key={item}
              handleClickColor={handleClickColor}
              item={item}
              selectedColor={selectedColor}
            />
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-center px-4 pt-4 pb-2">
          <BiChevronDown />
          <p className="text-xs font-bold tracking-widest ml-3">SIZE</p>
        </div>
        <div className="grid grid-cols-5 pl-11 pr-3 mt-2 mb-4">
          {sizes.sort().map((item) => (
            <SizeTag
              key={item}
              handleClickSize={handleClickSize}
              item={item}
              selectedSize={selectedSize}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filter;
