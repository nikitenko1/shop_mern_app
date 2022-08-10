import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiFillStar, AiOutlineClose } from 'react-icons/ai';
import { createReview } from '../../redux/slices/reviewSlice';
import Loader from './../../components/global/Loader';

const ReviewModal = ({ reviewRef }) => {
  const [star, setStar] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { auth, review } = useSelector((state) => state);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!star || !comment) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          errors: 'Please provide star rating and the review comment.',
        },
      });
    }

    const reviewData = {
      user: auth.user,
      star,
      content: comment,
      createdAt: new Date().toISOString(),
      product: review.isOpen.toString(),
      like: [],
    };

    await dispatch(
      dispatch(createReview({ reviewData, token: `${auth.token}` }))
    );
    setLoading(false);
    
    dispatch({ type: 'review/open_modal', payload: false });
  };
  return (
    <div
      className={`${review.isOpen ? 'opacity-100' : 'opacity-0'} ${
        review.isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      } z-[9999] transition-opacity fixed top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,.7)] flex justify-center items-center px-5`}
    >
      <div
        ref={reviewRef}
        className={`${
          review.isOpen ? 'translate-y-0' : '-translate-y-12'
        } transition-transform w-full max-w-[500px] bg-white rounded-md`}
      >
        <div className="flex items-center justify-between border-b border-gray-300 p-5 font-opensans">
          <h1>Review Product</h1>
          <AiOutlineClose
            onClick={() =>
              dispatch({ type: 'review/open_modal', payload: false })
            }
            className="cursor-pointer"
          />
        </div>
        <div className="p-5 font-opensans">
          <div className="mb-4">
            <p>Rating</p>
            <div className="flex items-center mt-2 gap-2">
              {Array.from(Array(star).keys()).map((_, idx) => (
                <AiFillStar
                  key={idx}
                  className="text-2xl text-orange-400"
                  onMouseOver={() => setStar(idx + 1)}
                />
              ))}
              {Array.from(Array(5 - star).keys()).map((_, idx) => (
                <AiFillStar
                  key={idx}
                  className="text-2xl text-gray-300"
                  onMouseOver={() => setStar(idx + star + 1)}
                />
              ))}
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="comment">Comment</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="outline-0 border border-gray-300 rounded-md w-full p-2 text-sm resize-none mt-2 h-[100px]"
              />
            </div>
            <button
              disabled={loading ? true : false}
              className={`${
                loading
                  ? 'bg-blue-300 hover:bg-blue-300 cursor-auto'
                  : 'bg-[#3552DC] hover:bg-[#122DB0] cursor-pointer'
              } transition-[background] text-white text-sm rounded-full px-5 py-2 mt-4 float-right`}
            >
              {loading ? <Loader /> : 'Rate Product'}
            </button>
            <div className="clear-both" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
