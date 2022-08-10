import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NotFound from '../components/global/NotFound';
import ComposeNewsletterModal from '../components/modal/ComposeNewsletterModal';
import HeadInfo from '../utils/HeadInfo';
import Layout from './../components/admin/Layout';
import Loader from './../components/global/Loader';
import { getNewsletters } from '../redux/slices/newsletterSlice';

const Newsletter = () => {
  const [currPage, setCurrPage] = useState(1);
  const [newsletters, setNewsletters] = useState([]);
  const [openComposeModal, setOpenComposeModal] = useState(false);

  const dispatch = useDispatch();
  const { auth, newsletter, alert } = useSelector((state) => state);

  const handlePaginationArrow = (type) => {
    let newPage = 0;

    if (type === 'prev') {
      newPage = currPage - 1;
      if (newPage < 1) {
        newPage = 1;
      }
    } else if (type === 'next') {
      newPage = currPage + 1;
      if (newPage > newsletter.totalPage) {
        newPage = newsletter.totalPage;
      }
    }

    setCurrPage(newPage);
  };

  const composeModalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openComposeModal &&
        composeModalRef.current &&
        !composeModalRef.current.contains(e.target)
      ) {
        setOpenComposeModal(false);
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
  }, [openComposeModal, setOpenComposeModal]);

  useEffect(() => {
    dispatch(getNewsletters({ token: `${auth.token}`, page: currPage }));
  }, [dispatch, auth.token, currPage]);

  useEffect(() => {
    setNewsletters(newsletter.data);
  }, [newsletter]);

  if (auth.user?.role !== 'admin') {
    return <NotFound />;
  }

  return (
    <>
      <HeadInfo title="Newsletter" />
      <Layout>
        <div className="flex items-center justify-between gap-10">
          <h1 className="text-2xl tracking-wide font-oswald">
            Sent Newsletter
          </h1>
          <button
            onClick={() => setOpenComposeModal(true)}
            className="bg-blue-500 rounded-full px-5 py-2 hover:bg-blue-600 transition-[background] text-sm text-white"
          >
            Compose Newsletter
          </button>
        </div>
        {alert.loading ? (
          <Loader size="xl" />
        ) : (
          <div className="overflow-x-auto mt-8">
            <table className="w-full">
              <thead>
                <tr className="text-sm bg-[#3552DC] text-white">
                  <th className="p-3">No</th>
                  <th>Title</th>
                </tr>
              </thead>
              <tbody>
                {newsletters.map((item, idx) => (
                  <tr
                    key={item._id}
                    className="text-sm text-center bg-gray-100"
                  >
                    <td className="p-3">{idx + 1}</td>
                    <td>{item.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {newsletter.totalPage > 1 && (
              <>
                <div className="flex mt-6 border border-gray-300 rounded-md w-fit float-right">
                  {currPage > 1 && (
                    <div
                      onClick={() => handlePaginationArrow('prev')}
                      className="cursor-pointer py-2 px-4 border-r border-gray-300"
                    >
                      &lt;
                    </div>
                  )}

                  {Array.from(Array(newsletter.totalPage).keys()).map(
                    (_, idx) => (
                      <div
                        key={idx}
                        onClick={() => setCurrPage(idx + 1)}
                        className={`cursor-pointer py-2 px-4 border-r border-gray-300 ${
                          currPage === idx + 1
                            ? 'bg-[#3552DC] text-white'
                            : undefined
                        }`}
                      >
                        {idx + 1}
                      </div>
                    )
                  )}

                  {currPage < newsletter.totalPage && (
                    <div
                      onClick={() => handlePaginationArrow('next')}
                      className="cursor-pointer py-2 px-4"
                    >
                      &gt;
                    </div>
                  )}
                </div>
                <div className="clear-both" />
              </>
            )}
            {newsletter.totalPage > 1 && (
              <>
                <div className="flex mt-6 border border-gray-300 rounded-md w-fit float-right">
                  {currPage > 1 && (
                    <div
                      onClick={() => handlePaginationArrow('prev')}
                      className="cursor-pointer py-2 px-4 border-r border-gray-300"
                    >
                      &lt;
                    </div>
                  )}

                  {Array.from(Array(newsletter.totalPage).keys()).map(
                    (_, idx) => (
                      <div
                        key={idx}
                        onClick={() => setCurrPage(idx + 1)}
                        className={`cursor-pointer py-2 px-4 border-r border-gray-300 ${
                          currPage === idx + 1
                            ? 'bg-[#3552DC] text-white'
                            : undefined
                        }`}
                      >
                        {idx + 1}
                      </div>
                    )
                  )}

                  {currPage < newsletter.totalPage && (
                    <div
                      onClick={() => handlePaginationArrow('next')}
                      className="cursor-pointer py-2 px-4"
                    >
                      &gt;
                    </div>
                  )}
                </div>
                <div className="clear-both" />
              </>
            )}
          </div>
        )}

        <ComposeNewsletterModal
          openModal={openComposeModal}
          setOpenModal={setOpenComposeModal}
          modalRef={composeModalRef}
        />
      </Layout>
    </>
  );
};

export default Newsletter;
