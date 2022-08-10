import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiFillHeart, AiFillStar } from 'react-icons/ai';
import { likeReview, unlikeReview } from '../../redux/slices/reviewSlice';

const Review = ({ item }) => {
  const [isLike, setIsLike] = useState(false);

  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const handleLike = () => {
    if (!auth.token) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'Please login to like review.',
        },
      });
    }

    if (isLike) {
      setIsLike(false);
      dispatch(
        unlikeReview({
          id: item._id,
          product: item.product,
          token: `${auth.token}`,
        })
      );
    } else {
      setIsLike(true);
      dispatch(
        likeReview({
          id: item._id,
          product: item.product,
          token: `${auth.token}`,
        })
      );
    }
  };

  useEffect(() => {
    const findLike = item.like?.find((i) => i === auth.user?._id);
    if (findLike) {
      setIsLike(true);
    }

    return () => setIsLike(false);
  }, [auth.user, item]);

  return (
    <div className="flex md:flex-row flex-col gap-8 border-b border-gray-300 py-7">
      <div className="flex gap-5">
        <div className="w-10 h-10 bg-gray-300 rounded-full">
          <img
            src={item.user.avatar}
            alt={item.user.name}
            className="rounded-full"
          />
        </div>
        <div>
          <p className="font-bold font-opensans text-xs mb-1">
            {item.user.name}
          </p>
          <div className="flex items-center">
            {Array.from(Array(item.star).keys()).map((_, idx) => (
              <AiFillStar key={idx} className="text-sm text-orange-400" />
            ))}
            {Array.from(Array(5 - item.star).keys()).map((_, idx) => (
              <AiFillStar key={idx} className="text-sm text-gray-300" />
            ))}
          </div>
        </div>
      </div>
      <div>
        <p className="font-opensans text-sm text-justify text-gray-600 leading-6">
          {item.content}
        </p>
        <div className={`flex items-center gap-2 mt-3 text-gray-400 text-sm`}>
          <AiFillHeart
            onClick={handleLike}
            className={`${
              isLike ? 'text-red-500' : 'text-gray-400'
            } cursor-pointer`}
          />
          {item.like?.length}
        </div>
      </div>
    </div>
  );
};

export default Review;
