import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import Editor from '../global/Editor';
import { createNewsletter } from '../../redux/slices/newsletterSlice';
import Loader from '../global/Loader';

const ComposeNewsletterModal = ({ openModal, setOpenModal, modalRef }) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'Please provide title and content for newsletter.',
        },
      });
    }
    if (title.length < 20) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'Newsletter title should be at least 20 characters.',
        },
      });
    }
    if (content.length < 200) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'Newsletter content should be at least 200 characters.',
        },
      });
    }
    setLoading(true);
    await dispatch(
      createNewsletter({ data: { title, content }, token: `${auth.token}` })
    );
    setLoading(false);
    setOpenModal(false);
  };

  return (
    <div
      className={`${openModal ? 'opacity-100' : 'opacity-0'} ${
        openModal ? 'pointer-events-auto' : 'pointer-events-none'
      } transition-opacity fixed top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,.7)] z-[9999] flex justify-center items-center px-5 font-opensans`}
    >
      <div
        ref={modalRef}
        className={`${
          openModal ? 'translate-y-0' : '-translate-y-12'
        } transition-transform w-full max-w-[700px] bg-white rounded-md`}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b boder-gray-300">
          <h1>Compose Newsletter</h1>
          <AiOutlineClose
            onClick={() => setOpenModal(false)}
            className="cursor-pointer"
          />
        </div>
        <div className="p-5 max-h-[500px] overflow-auto hide-scrollbar">
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="title" className="text-sm">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                autoComplete="off"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border mt-3 border-gray-300 rounded-md p-2 outline-0 w-full text-sm"
              />
            </div>
            <div className="mt-5">
              <label className="text-sm mb-3 block">Content</label>
              <Editor content={content} setContent={setContent} />
            </div>
            <button
              type="submit"
              disabled={loading ? true : false}
              className={`${
                loading
                  ? 'bg-blue-200 hover:bg-blue-200 cursor-auto'
                  : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
              } transition-[background] px-4 py-2 rounded-md text-white text-sm mt-7`}
            >
              {loading ? <Loader /> : 'Compose'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComposeNewsletterModal;
