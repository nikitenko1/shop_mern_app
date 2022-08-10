import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineEdit } from 'react-icons/ai';
import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa';
import { numberFormatter } from '../../utils/numberFormatter';
import { getBanner } from '../../redux/slices/bannerSlice';
import ChooseBannerModal from '../modal/ChooseBannerModal';
import { GoLinkExternal } from 'react-icons/go';

const HighlightedItem = ({ admin }) => {
  const [currSlide, setCurrSlide] = useState(1);
  const [openChooseBannerModal, setOpenChooseBannerModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState();

  const chooseBannerModalRef = useRef();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { banner, auth } = useSelector((state) => state);

  const handleArrow = (type) => {
    if (type === 'prev') {
      if (currSlide === 1) setCurrSlide(2);
      else setCurrSlide(currSlide - 1);
    } else if (type === 'next') {
      if (currSlide === 2) setCurrSlide(1);
      else setCurrSlide(currSlide + 1);
    }
  };

  const handleClickButton = (item) => {
    if (admin) {
      setSelectedBanner(item);
      setOpenChooseBannerModal(true);
    } else {
      navigate(`/product/${item.product._id}`);
    }
  };

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        openChooseBannerModal &&
        chooseBannerModalRef.current &&
        !chooseBannerModalRef.current.contains(e.target)
      ) {
        setOpenChooseBannerModal(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);
    return () =>
      document.removeEventListener('mousedown', checkIfClickedOutside);
  }, [openChooseBannerModal]);

  useEffect(() => {
    dispatch(getBanner());
  }, [dispatch, selectedBanner]);

  return (
    <>
      <div className="relative flex flex-col md:flex-row">
        <FaChevronCircleLeft
          onClick={() => handleArrow('prev')}
          className="md:hidden absolute top-[50%] text-white left-4 cursor-pointer text-xl"
        />
        <div
          className={`md:flex ${
            currSlide === 1 ? 'flex' : 'hidden'
          } flex-1 items-center justify-between bg-gradient-to-l from-[#6CB9EF] to-[#2B88D6] px-12 py-7 md:flex-row flex-col flex-col-reverse gap-4`}
        >
          {banner[0] && (
            <div className="flex-1 text-white">
              <p className="text-sm mt-6 md:mt-8 mb-2">
                {numberFormatter(banner[0]?.product.price)}
              </p>
              <h2 className="text-2xl font-oswald">
                {banner[0]?.product.name}
              </h2>
              <button
                onClick={() => handleClickButton(banner[0])}
                className={`md:mt-8 mt-5 rounded-full drop-shadow-2xl bg-blue-400 text-sm ${
                  admin ? 'w-24' : 'w-28'
                } h-10 flex items-center justify-center gap-3`}
              >
                {auth.user?.role === 'admin' ? (
                  <>
                    <AiOutlineEdit />
                    Detail
                  </>
                ) : (
                  <>
                    <GoLinkExternal />
                    Detail
                  </>
                )}
              </button>
            </div>
          )}
          {banner[0] && (
            <div className="w-fit">
              <img
                src={banner[0]?.product.images[0]}
                alt={banner[0]?.product.name}
                className="w-[300px]"
              />
            </div>
          )}
        </div>
        <FaChevronCircleRight
          className="md:hidden absolute top-[50%] right-4 text-white cursor-pointer text-xl"
          onClick={() => handleArrow('next')}
        />
        <div
          className={`md:flex ${
            currSlide === 2 ? 'flex' : 'hidden'
          } flex-1 items-center justify-between bg-gradient-to-l from-[#8A79EC] to-[#4D44DB] px-12 py-7 md:flex-row flex-col flex-col-reverse gap-4`}
        >
          {banner[1] && (
            <div className="flex-1 text-white">
              <p className="text-sm mt-6 md:mt-8 mb-2">
                {numberFormatter(banner[1]?.product.price)}
              </p>
              <h2 className="text-2xl font-oswald">
                {banner[1]?.product.name}
              </h2>
              <button
                onClick={() => handleClickButton(banner[1])}
                className={`md:mt-8 mt-5 rounded-full drop-shadow-2xl bg-[#7465E2] text-sm ${
                  admin ? 'w-24' : 'w-28'
                } h-10 flex items-center justify-center gap-3`}
              >
                {auth.user?.role === 'admin' ? (
                  <>
                    <AiOutlineEdit />
                    Detail
                  </>
                ) : (
                  <>
                    <GoLinkExternal />
                    Detail
                  </>
                )}
              </button>
            </div>
          )}
          {banner[1] && (
            <div className="w-fit">
              <img
                src={banner[1]?.product.images[0]}
                alt={banner[1]?.product.name}
                className="w-[300px]"
              />
            </div>
          )}
        </div>
      </div>

      <ChooseBannerModal
        openChooseBannerModal={openChooseBannerModal}
        setOpenChooseBannerModal={setOpenChooseBannerModal}
        chooseBannerModalRef={chooseBannerModalRef}
        selectedBanner={selectedBanner}
      />
    </>
  );
};

export default HighlightedItem;
