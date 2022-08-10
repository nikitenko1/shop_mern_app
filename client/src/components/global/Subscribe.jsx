import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { HiMail } from 'react-icons/hi';
import { createSubscriber } from './../../redux/slices/subscriberSlice';
import { validateEmail } from '../../utils/validateEmail';

const Subscribe = () => {
  const [email, setEmail] = useState('');

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          errors: 'Please provide email address to subscribe.',
        },
      });
    }

    if (!validateEmail(email)) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          errors: 'Please provide correct email format.',
        },
      });
    }
    dispatch(createSubscriber({ email: email }));
    setEmail('');
  };
  return (
    <div className="bg-gray-200 px-10 pt-28 pb-12 text-center -mt-[90px] leading-relaxed">
      <h1 className="font-oswald text-xl tracking-wider font-bold">
        SUBSCRIBE TO OUR NEWSLETTER
      </h1>
      <p className="text-gray-500">
        Subscribe to our newsletter to get the latest news from{' '}
        <span className="font-bold text-green-500">Let&apos;s work ||</span>{' '}
        about store discount and event.
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-between drop-shadow-2xl bg-white w-full max-w-[400px] rounded-full m-auto pl-2 pr-4 py-2"
      >
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-transparent px-3 outline-0 font-opensans w-full"
        />
        <HiMail className="text-blue-700 text-xl" />
      </form>
    </div>
  );
};

export default Subscribe;
