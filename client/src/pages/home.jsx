import Navbar from './../components/global/Navbar';
import Footer from './../components/global/Footer';
import Header from './../components/home/Header';
import HeadInfo from '../utils/HeadInfo';
import Subscribe from '../components/global/Subscribe';
import ProductList from './../components/home/ProductList';

const Home = () => {
  return (
    <>
      <HeadInfo title="Home" />
      <Navbar />
      <Header />
      <ProductList />
      <Subscribe />
      <Footer />
    </>
  );
};

export default Home;
