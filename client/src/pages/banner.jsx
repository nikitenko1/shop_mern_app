import { useSelector } from 'react-redux';
import Layout from '../components/admin/Layout';
import NotFound from './../components/global/NotFound';
import HighlightedItem from '../components/home/HighlightedItem';
import HeadInfo from '../utils/HeadInfo';

const Display = () => {
  const { auth } = useSelector((state) => state);

  if (auth.user?.role !== 'admin') {
    return <NotFound />;
  }

  return (
    <>
      <HeadInfo title="Banner Management" />
      <Layout>
        <>
          <div className="flex items-center justify-between gap-10">
            <h1 className="text-2xl tracking-wide font-oswald">
              Home Banner Display
            </h1>
          </div>
          <div className="mt-7">
            <HighlightedItem admin={true} />
          </div>
        </>
      </Layout>
    </>
  );
};

export default Display;
