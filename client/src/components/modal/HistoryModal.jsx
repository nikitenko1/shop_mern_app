import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { GoPackage } from 'react-icons/go';
import { RiSecurePaymentLine } from 'react-icons/ri';
import { MdLocationOn } from 'react-icons/md';
import { FaPercentage } from 'react-icons/fa';

const HistoryModal = ({
  modalRef,
  openHistoryModal,
  setOpenHistoryModal,
  selectedItem,
}) => {
  return (
    <div
      className={`${openHistoryModal ? 'opacity-100' : 'opacity-0'} ${
        openHistoryModal ? 'pointer-events-auto' : 'pointer-events-none'
      } transition-opacity fixed top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,.7)] z-[9999] flex justify-center items-center px-10 font-opensans`}
    >
      <div
        ref={modalRef}
        className={`${
          openHistoryModal ? 'translate-y-0' : '-translate-y-12'
        } transition-transform w-full max-w-[500px] bg-white rounded-md`}
      >
        <div className="flex items-center justify-between px-7 py-3 border-b border-gray-300">
          <h1 className="text-lg">Transaction Detail</h1>
          <AiOutlineClose
            onClick={() => setOpenHistoryModal(false)}
            className="cursor-pointer"
          />
        </div>
        <div className="px-7 pb-5 max-h-[60vh] overflow-auto hide-scrollbar">
          <div className="flex items-center gap-7 py-5 border-b border-gray-300">
            <div className="w-20 h-20 border border-gray-300 rounded-md flex items-center justify-center p-2">
              <MdLocationOn className="text-5xl" />
            </div>
            <div>
              <h1 className="font-oswald text-lg">
                province, city, district, postalCode
              </h1>
              <p className="text-sm my-1">address</p>
              <p className="text-sm">expedition - expeditionService : Fee</p>
            </div>
          </div>
          <div className="flex items-center gap-7 py-5 border-b border-gray-300">
            <div className="w-20 h-20 border border-gray-300 rounded-md flex items-center justify-center p-2">
              <GoPackage className="text-5xl" />
            </div>
            <div>
              <h1 className="font-oswald text-lg">recipientName</h1>
              <p className="text-sm my-1">recipientEmail</p>
              <p className="text-sm">recipientPhone</p>
            </div>
          </div>
          <div className="flex items-center gap-7 py-5 border-b border-gray-300">
            <div className="w-20 h-20 border border-gray-300 rounded-md flex items-center justify-center p-2">
              <RiSecurePaymentLine className="text-5xl" />
            </div>
            <div>
              <div className="flex items-center gap-4">
                <h1 className="font-oswald text-lg">Payment Method</h1>
                <p
                  className={`text-xs font-medium text-white bg-green-500 rounded-md p-1`}
                >
                  paymentStatus === 'SUCCEEDED'
                </p>
              </div>
              <p className="text-sm my-1">PayPal: +paypalPhoneNumber</p>
            </div>
          </div>

          <div className="flex items-center gap-7 py-5 border-b border-gray-300">
            <div className="w-20 h-20 border border-gray-300 rounded-md flex items-center justify-center p-2">
              <img
                src={`${process.env.PUBLIC_URL}/images/bmw.jpg`}
                alt="item"
              />
            </div>
            <div>
              <h1 className="font-oswald text-lg">product : product.name</h1>
              <p className="text-sm my-1">Qty: qty</p>
              <p className="text-sm my-1">Price: product.price x qty</p>
              discount !== 0 &&{' '}
              <p className="text-sm">Discount per item: discount%</p>
            </div>
          </div>

          <div className="flex items-center gap-7 pt-5">
            <div className="w-20 h-20 border border-gray-300 rounded-md flex items-center justify-center p-2">
              <FaPercentage className="text-5xl" />
            </div>
            <div>
              <h1 className="font-oswald text-lg">discount.code</h1>
              <p className="text-sm my-1">Discount Voucher</p>
              <p className="text-sm">discount.value%</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-7 py-3 border-t border-gray-300">
          <h1 className="font-bold">Total</h1>
          <p>totalPrice</p>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
