import { useState, useEffect } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { getReview } from '../../redux/slices/reviewSlice';
import { getDataAPI } from '../../utils/fetchData';
import Review from './Review';

const ReviewContainer = ({ id }) => {
  const [reviews, setReviews] = useState([]);
  const [eligibleStatus, setEligibleStatus] = useState(false);
  const [currPage, setCurrPage] = useState(1);

  const dispatch = useDispatch();
  const { auth, review } = useSelector((state) => state);

  useEffect(() => {
    if (auth.token) {
      getDataAPI(`review/check/${id}`, `${auth.token}`).then((res) => {
        setEligibleStatus(res.data.status);
      });
    }

    return () => setEligibleStatus(false);
  }, [auth.token, id]);

  useEffect(() => {
    dispatch(getReview({ id: id, page: currPage }));
  }, [dispatch, id, currPage]);

  useEffect(() => {
    setReviews(review.data);
  }, [review]);

  return (
    <div className="bg-gray-100 md:px-16 px-8 md:flex-row flex flex-col py-10 gap-10">
      <div className="flex-[3]">
        <div className="flex gap-5 font-oswald border-b border-gray-300 pb-5">
          <p className="tracking-wide">All Reviews</p>
          <p className="text-blue-600">{reviews.length}</p>
        </div>
        <div>
          {reviews.length === 0 ? (
            <div className="bg-red-500 text-sm text-white p-3 text-center rounded-md mt-5">
              This product has no review yet.
            </div>
          ) : (
            <>
              {reviews.map((item) => (
                <Review key={item._id} item={item} />
              ))}
            </>
          )}
        </div>
        <div className="flex items-center justify-end mt-6 gap-7 text-sm">
          {review.totalPage > 1 &&
            Array.from(Array(review.totalPage)).map((_, idx) => (
              <p
                key={idx}
                onClick={() => setCurrPage(idx + 1)}
                className={`cursor-pointer hover:font-bold ${
                  currPage === idx + 1 ? 'font-bold' : undefined
                }`}
              >
                {idx + 1}
              </p>
            ))}
        </div>
      </div>
      <div className="flex-1">
        <div className="border-b border-gray-300 pb-5">
          <p className="font-oswald tracking-wide">Reviews Overall</p>
        </div>
        <div className="mb-6">
          <div className="flex items-center justify-between mt-6 mb-3">
            <div className="flex gap-1">
              <AiFillStar className="text-orange-400" />
              <AiFillStar className="text-orange-400" />
              <AiFillStar className="text-orange-400" />
              <AiFillStar className="text-orange-400" />
              <AiFillStar className="text-orange-400" />
            </div>
            <p className="text-xs text-gray-400 font-bold">
              {reviews.filter((item) => item.star === 5).length}{' '}
              {reviews.filter((item) => item.star === 5).length > 1
                ? 'Reviews'
                : 'Review'}
            </p>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-1">
              <AiFillStar className="text-orange-400" />
              <AiFillStar className="text-orange-400" />
              <AiFillStar className="text-orange-400" />
              <AiFillStar className="text-orange-400" />
              <AiFillStar className="text-gray-300" />
            </div>
            <p className="text-xs text-gray-400 font-bold">
              {reviews.filter((item) => item.star === 4).length}{' '}
              {reviews.filter((item) => item.star === 4).length > 1
                ? 'Reviews'
                : 'Review'}
            </p>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-1">
              <AiFillStar className="text-orange-400" />
              <AiFillStar className="text-orange-400" />
              <AiFillStar className="text-orange-400" />
              <AiFillStar className="text-gray-300" />
              <AiFillStar className="text-gray-300" />
            </div>
            <p className="text-xs text-gray-400 font-bold">
              {reviews.filter((item) => item.star === 3).length}{' '}
              {reviews.filter((item) => item.star === 3).length > 1
                ? 'Reviews'
                : 'Review'}
            </p>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-1">
              <AiFillStar className="text-orange-400" />
              <AiFillStar className="text-orange-400" />
              <AiFillStar className="text-gray-300" />
              <AiFillStar className="text-gray-300" />
              <AiFillStar className="text-gray-300" />
            </div>
            <p className="text-xs text-gray-400 font-bold">
              {reviews.filter((item) => item.star === 2).length}{' '}
              {reviews.filter((item) => item.star === 2).length > 1
                ? 'Reviews'
                : 'Review'}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              <AiFillStar className="text-orange-400" />
              <AiFillStar className="text-gray-300" />
              <AiFillStar className="text-gray-300" />
              <AiFillStar className="text-gray-300" />
              <AiFillStar className="text-gray-300" />
            </div>
            <p className="text-xs text-gray-400 font-bold">
              {reviews.filter((item) => item.star === 1).length}{' '}
              {reviews.filter((item) => item.star === 1).length > 1
                ? 'Reviews'
                : 'Review'}
            </p>
          </div>
        </div>
        {auth.token && eligibleStatus && (
          <button
            onClick={() => dispatch({ type: 'review/open_modal', payload: id })}
            className="bg-[#3552DC] rounded-full text-white text-sm w-full h-9 drop-shadow-xl hover:bg-[#122DB0] transition-[background]"
          >
            Add Review
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewContainer;
