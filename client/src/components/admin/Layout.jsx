import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="px-10 py-5 w-full">
        <Navbar />
        <div className="font-opensans mt-9">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
