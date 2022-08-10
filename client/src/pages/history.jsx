import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './../components/global/Navbar';
import Header from './../components/home/Header';
import Subscribe from './../components/global/Subscribe';
import Footer from './../components/global/Footer';
import HistoryModal from './../components/modal/HistoryModal';
import Loader from '../components/global/Loader';
import NotFound from './../components/global/NotFound';
import HeadInfo from '../utils/HeadInfo';

const History = () => {
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState();

  const modalRef = useRef();

  const dispatch = useDispatch();
  const { auth, alert, checkout } = useSelector((state) => state);

  const handleClickDetail = (item) => {
    setOpenHistoryModal(true);
    setSelectedItem(item);
  };

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        openHistoryModal &&
        modalRef.current &&
        !modalRef.current.contains(e.target)
      ) {
        setOpenHistoryModal(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);
    return () =>
      document.removeEventListener('mousedown', checkIfClickedOutside);
  }, [openHistoryModal]);

  if (auth.user?.role !== 'user') {
    return <NotFound />;
  }
  return (
    <>
      <HeadInfo title="Transaction History" />
      <Navbar />
      <Header />
      <div className="m-auto bg-white w-10/12 drop-shadow-2xl -translate-y-10 font-opensans p-7">
        <h1 className="text-2xl mb-8">Transaction History</h1>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-sm bg-gray-600 text-white">
                <th className="p-3">No</th>
                <th>Date</th>
                <th>Transaction ID</th>
                <th>Payment Method</th>
                <th>Total Price</th>
                <th>Total Discount</th>
                <th>Total Items</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-sm text-center bg-gray-100">
                <td className="p-3">1</td>
                <td>{new Date().toLocaleDateString()}</td>
                <td> item._id</td>
                <td> PayPal</td>
                <td> item.totalPrice</td>
                <td> item.discount</td>
                <td> item.items.length</td>
                <td>
                  <button
                    onClick={() => handleClickDetail()}
                    className="bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition-[background]"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <Subscribe />
      <Footer />
      <HistoryModal
        modalRef={modalRef}
        openHistoryModal={openHistoryModal}
        setOpenHistoryModal={setOpenHistoryModal}
        selectedItem={selectedItem}
      />
    </>
  );
};

export default History;
