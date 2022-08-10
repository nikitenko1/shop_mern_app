import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai';
import { getDataAPI } from '../../utils/fetchData';
import { numberFormatter } from '../../utils/numberFormatter';

const SearchModal = ({
  navbarSearchRef,
  openNavbarSearch,
  setOpenNavbarSearch,
}) => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  const navigate = useNavigate();

  const handleClickTitle = (id) => {
    navigate(`/product/${id}`);
    setOpenNavbarSearch(false);
    setSearch('');
    setSearchResult([]);
  };

  useEffect(() => {
    if (search.length > 3) {
      getDataAPI(`product/search?name=${search}`).then((res) => {
        setSearchResult(res.data.products);
      });
    }

    return () => setSearchResult([]);
  }, [search]);

  return (
    <div
      className={`${openNavbarSearch ? 'opacity-100' : 'opacity-0'} ${
        openNavbarSearch ? 'pointer-events-auto' : 'pointer-events-none'
      } transition-opacity fixed top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,.7)] z-[9999] flex justify-center items-start py-20 px-5`}
    >
      <div
        ref={navbarSearchRef}
        className={`${
          openNavbarSearch ? 'translate-y-0' : '-translate-y-12'
        } transition-transform w-full max-w-[600px] bg-white p-5 rounded-md`}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-opensans">Search Product</h2>
          <AiOutlineClose
            onClick={() => setOpenNavbarSearch(false)}
            className="text-xl cursor-pointer"
          />
        </div>
        <div className="flex items-center border rounded-md border-gray-400 p-3 mt-5">
          <AiOutlineSearch />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-0 flex-1 ml-3 text-sm font-opensans"
            placeholder="Enter product name ..."
          />
        </div>
        {searchResult.length > 0 ? (
          <div className="mt-5 max-h-[300px] overflow-auto hide-scrollbar">
            <h1 className="text-lg mb-3">Search Result</h1>
            {searchResult.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 border border-gray-300 rounded-md p-2 mb-5"
              >
                <div className="w-16 h-16 rounded-md flex items-center justify-center p-2 border border-gray-300">
                  <img src={item.images[0]} alt={item.name} />
                </div>
                <div>
                  <div className="flex items-center gap-4">
                    <h1
                      onClick={() => handleClickTitle(`${item._id}`)}
                      className="font-oswald text-xl mb-2 cursor-pointer"
                    >
                      {item.name}
                    </h1>
                    {item.discount !== 0 && (
                      <p className="py-1 px-2 text-xs bg-black text-white rounded-md">
                        -{item.discount}%
                      </p>
                    )}
                  </div>
                  <p className="text-sm">{numberFormatter(item.price)},00</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          search.length > 3 && (
            <p className="bg-red-500 text-white text-center p-3 mt-5 rounded-md text-sm">
              No product found with keyword {search}
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default SearchModal;
