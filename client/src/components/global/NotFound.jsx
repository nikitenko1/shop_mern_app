import HeadInfo from './../../utils/HeadInfo';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <>
      <HeadInfo title="404" />

      <div className="flex">
        <div className="flex-1">
          <div className="h-screen flex items-center justify-center flex-col">
            <p className="font-oswald text-2xl uppercase mb-3">Let's work ||</p>
            <p className="font-opensans text-lg mb-5">
              404 | Oops ... You got lost?
            </p>
            <Link
              className="bg-blue-400 hover:bg-blue-600 text-white text-sm rounded-md px-5 py-3"
              to="/"
            >
              Home
            </Link>
          </div>
        </div>
        <div className="md:block hidden flex-[2] pointer-events-none">
          <img
            src={`${process.env.PUBLIC_URL}/images/notfound.svg`}
            alt="Let's work Auth"
            className="w-full h-screen object-fit"
          />
        </div>
      </div>
    </>
  );
};

export default NotFound;
