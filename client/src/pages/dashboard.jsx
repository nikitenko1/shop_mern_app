import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NotFound from './../components/global/NotFound';
import HeadInfo from '../utils/HeadInfo';
import { getDashboardData } from './../redux/slices/dashboardSlice';
import Layout from './../components/admin/Layout';
import { ImUsers } from 'react-icons/im';
import { RiSecurePaymentFill } from 'react-icons/ri';
import { FaBoxes } from 'react-icons/fa';
import { SiNike } from 'react-icons/si';
import { MdOutlineAccountTree } from 'react-icons/md';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';

// A short registration format is also available to quickly register everything.
ChartJS.register(...registerables);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { auth, dashboard } = useSelector((state) => state);

  useEffect(() => {
    dispatch(getDashboardData({ token: `${auth.token}` }));
  }, [dispatch, auth.token]);

  if (auth.user?.role !== 'admin') {
    return <NotFound />;
  }

  return (
    <>
      <HeadInfo title="Dashboard" />
      <Layout>
        <h1 className="text-2xl tracking-wide font-oswald">Dashboard</h1>
        <div className="grid lg:grid-cols-5 md:grid-cols-2 sm:grid-cols-1 gap-5 mt-7">
          <div className="shadow-lg rounded-md flex items-center border border-gray-200 px-5 py-3 gap-6">
            <ImUsers className="text-5xl text-fuchsia-600" />
            <div>
              <p className="font-medium font-oswald text-gray-700">
                Total User
              </p>
              <p className="mt-1 font-oswald text-lg">{dashboard.totalUser}</p>
            </div>
          </div>
          <div className="shadow-lg rounded-md flex items-center border border-gray-200 px-5 py-3 gap-6">
            <RiSecurePaymentFill className="text-5xl text-fuchsia-600" />
            <div>
              <p className="font-medium font-oswald text-gray-700">
                Total Transaction
              </p>
              <p className="mt-1 font-oswald text-lg">
                {dashboard.totalTransaction}
              </p>
            </div>
          </div>
          <div className="shadow-lg rounded-md flex items-center border border-gray-200 px-5 py-3 gap-6">
            <FaBoxes className="text-5xl text-[#B246D5]" />
            <div>
              <p className="font-medium font-oswald text-gray-700">
                Total Product
              </p>
              <p className="mt-1 font-oswald text-lg">
                {dashboard.totalProduct}
              </p>
            </div>
          </div>
          <div className="shadow-lg rounded-md flex items-center border border-gray-200 px-5 py-3 gap-6">
            <SiNike className="text-5xl text-[#B246D5]" />
            <div>
              <p className="font-medium font-oswald text-gray-700">
                Total Brand
              </p>
              <p className="mt-1 font-oswald text-lg">{dashboard.totalBrand}</p>
            </div>
          </div>
          <div className="shadow-lg rounded-md flex items-center border border-gray-200 px-5 py-3 gap-6">
            <MdOutlineAccountTree className="text-5xl text-[#B246D5]" />
            <div>
              <p className="font-medium font-oswald text-gray-700">
                Total Category
              </p>
              <p className="mt-1 font-oswald text-lg">
                {dashboard.totalCategory}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-16 flex md:flex-row flex-col items-center gap-16">
          <div className="md:w-[550px] w-[450px]">
            {/* A bar chart provides a way of showing data values represented as vertical bars. */}
            <Bar
              data={{
                labels: dashboard.userGrowth.map((item) => item.month),
                datasets: [
                  {
                    label: 'User Growth',
                    data: dashboard.userGrowth.map((item) => item.count),
                    backgroundColor: ['skyblue', 'violet'],
                  },
                ],
              }}
            />
          </div>
          <div className="md:w-[550px] w-[450px]">
            {/* A line chart is a way of plotting data points on a line.  */}
            <Line
              data={{
                labels: dashboard.monthlyTransaction.map((item) => item.month),
                datasets: [
                  {
                    label: 'Transaction Growth',
                    data: dashboard.monthlyTransaction.map(
                      (item) => item.count
                    ),
                  },
                ],
              }}
            />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Dashboard;
