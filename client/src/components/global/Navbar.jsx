import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AiOutlineSearch,
  AiOutlineUser,
  AiFillDashboard,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from 'react-icons/ai';
import { FaClipboardList, FaUserEdit } from 'react-icons/fa';
import { MdLogout } from 'react-icons/md';
import { logout } from './../../redux/slices/authSlice';
import { addToCart, deleteItem, getCart } from './../../redux/slices/cartSlice';
import {
  deleteWishlist,
  getWishlist,
} from './../../redux/slices/wishlistSlice';
import { BiLock } from 'react-icons/bi';
import { IoMdTrash } from 'react-icons/io';
import { numberFormatter } from './../../utils/numberFormatter';
import { getDataAPI } from '../../utils/fetchData';
import AuthenticationModal from './../modal/AuthenticationModal';
import SearchModal from './../modal/SearchModal';

const Navbar = () => {
  const [openLike, setOpenLike] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openNavbarSearch, setOpenNavbarSearch] = useState(false);
  const [openAuthenticationModal, setOpenAuthenticationModal] = useState(false);
  const [openProfileDropdown, setOpenProfileDropdown] = useState(false);

  const { wishlist, auth, cart } = useSelector((state) => state);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.token) {
      dispatch(getWishlist({ token: `${auth.token}` }));
      dispatch(getCart({ token: `${auth.token}` }));
    }
  }, [dispatch, auth.token]);

  const handleLogout = () => {
    if (!auth.token) return;
    dispatch(logout({ token: `${auth.token}` }));

    navigate('/');
    setOpenProfileDropdown(false);
  };

  const handleWishlist = (id) => {
    dispatch(deleteWishlist({ id, token: `${auth.token}` }));
    dispatch(getWishlist({ token: `${auth.token}` }));
    setOpenLike(false);
  };

  const handleDeleteItem = (cartData) => {
    if (auth.token) cartData.token = auth.token;

    dispatch(deleteItem(cartData));

    dispatch(getCart({ token: `${auth.token}` }));
    setOpenCart(false);
  };

  const handleChangeQty = async (type, productId, color, size, qty) => {
    try {
      const productData = await getDataAPI(`product/${productId}`);
      const product = productData.data.product;

      let correspondingStock = 0;
      product.stock.forEach((item) => {
        if (item.size === parseInt(size)) {
          correspondingStock = item.stock;
        }
      });
      let newQty = qty;
      if (type === 'increase') {
        newQty = qty + 1;
        if (newQty > correspondingStock) {
          newQty -= 1;
          dispatch({
            type: 'alert/alert',
            payload: { error: 'newQty > correspondingStock' },
          });
        }
        dispatch(
          addToCart({
            id: productId,
            discount: product.discount,
            color: color,
            size: parseInt(size),
            qty: newQty,
            token: `${auth.token}`,
          })
        );
      } else {
        newQty = qty - 1;
        if (newQty < 1) {
          dispatch({
            type: 'alert/alert',
            payload: { error: 'newQty < 1' },
          });
        }
        dispatch(
          addToCart({
            id: productId,
            discount: product.discount,
            color: color,
            size: parseInt(size),
            qty: newQty,
            token: `${auth.token}`,
          })
        );
      }

      dispatch(getCart({ token: `${auth.token}` }));
    } catch (err) {
      dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  };

  const handleClickCheckout = () => {
    if (auth.token) {
      navigate('/checkout');
    } else {
      setOpenAuthenticationModal(true);
    }
  };

  const profileRef = useRef();
  const navbarSearchRef = useRef();
  const authenticationRef = useRef();
  const likeRef = useRef();
  const cartRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openLike && likeRef.current && !likeRef.current.contains(e.target)) {
        setOpenLike(false);
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
  }, [openLike, setOpenLike]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openProfileDropdown &&
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setOpenProfileDropdown(false);
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
  }, [openProfileDropdown, setOpenProfileDropdown]);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        openNavbarSearch &&
        navbarSearchRef.current &&
        !navbarSearchRef.current.contains(e.target)
      ) {
        setOpenNavbarSearch(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);
    return () =>
      document.removeEventListener('mousedown', checkIfClickedOutside);
  }, [openNavbarSearch]);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        openAuthenticationModal &&
        authenticationRef.current &&
        !authenticationRef.current.contains(e.target)
      ) {
        setOpenAuthenticationModal(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);
    return () =>
      document.removeEventListener('mousedown', checkIfClickedOutside);
  }, [openAuthenticationModal]);

  return (
    <>
      <div className="flex items-center justify-between bg-gray-700 text-slate-50 px-7 py-4 drop-shadow-xl sticky top-0 z-[999]">
        <div onClick={() => setOpenNavbarSearch(true)}>
          <AiOutlineSearch className="text-lg cursor-pointer" />
        </div>
        <Link
          to="/"
          className="font-bold font-opensans tracking-widest md:translate-x-16"
        >
          Let's work ||
        </Link>
        <div className="flex items-center gap-3 md:gap-6">
          {auth.user ? (
            <div className="relative">
              <div
                onClick={() => setOpenProfileDropdown(!openProfileDropdown)}
                className="w-6 h-6 rounded-full bg-gray-100 cursor-pointer drop-shadow-md outline outline-1 outline-gray-600 hover:outline-offset-2"
              >
                <img
                  src={auth.user?.avatar}
                  alt={auth.user?.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div
                ref={profileRef}
                className={`${
                  openProfileDropdown ? 'scale-y-1' : 'scale-y-0'
                } transition-[transform] origin-top absolute w-[200px] bg-white right-0 translate-y-3 rounded-md shadow-xl text-black font-opensans`}
              >
                {auth.user?.role === 'user' ? (
                  <>
                    <Link
                      to="/password"
                      className="flex items-center gap-2 border-b border-gray-300 px-3 py-2 hover:bg-gray-100 rounded-tl-md rounded-tr-md"
                    >
                      <BiLock />
                      <p>Change Password</p>
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 border-b border-gray-300 px-3 py-2 hover:bg-gray-100 rounded-tl-md rounded-tr-md"
                    >
                      <FaUserEdit />
                      <p>Edit Profile</p>
                    </Link>
                    <Link
                      to="/history"
                      className="flex items-center gap-2 border-b border-gray-300 px-3 py-2 hover:bg-gray-100"
                    >
                      <FaClipboardList />
                      <p>Transaction History</p>
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 border-b border-gray-300 px-3 py-2 hover:bg-gray-100 rounded-tl-md rounded-tr-md"
                  >
                    <AiFillDashboard />
                    <p>Dashboard</p>
                  </Link>
                )}
                <div
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-bl-md rounded-br-md"
                >
                  <MdLogout />
                  <p>Logout</p>
                </div>
              </div>
            </div>
          ) : (
            <AiOutlineUser
              onClick={() => setOpenAuthenticationModal(true)}
              className="text-lg cursor-pointer"
            />
          )}
          <div className="relative">
            <div className="relative">
              <AiOutlineHeart
                onClick={() => setOpenLike(!openLike)}
                className="text-lg cursor-pointer"
              />
              {wishlist.data.length > 0 && (
                <div className="absolute -top-2 -right-2 bg-orange-500 rounded-full w-4 h-4 text-white flex items-center justify-center text-xs font-bold">
                  {wishlist.data.length}
                </div>
              )}
            </div>
            {wishlist.data && wishlist.data.length > 0 && (
              <div
                ref={likeRef}
                className={`${
                  openLike ? 'scale-y-1' : 'scale-y-0'
                } transition-[transform] origin-top absolute w-[300px] bg-white right-0 translate-y-3 rounded-md shadow-xl max-h-[350px] overflow-auto hide-scrollbar`}
              >
                {wishlist.data &&
                  wishlist.data.map((item, idx) => (
                    <div
                      key={idx}
                      className="font-opensans text-black flex items-center p-3"
                    >
                      <div className="w-20 h-20 bg-gray-300 flex items-center justify-center p-2">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                        />
                      </div>
                      <div className="ml-3">
                        <h2 className="font-oswald text-lg tracking-wide">
                          {item.product.name}
                        </h2>
                        <p className="my-1 text-sm">
                          {numberFormatter(item.product.price)}
                        </p>

                        <p
                          onClick={() =>
                            dispatch(
                              deleteWishlist(handleWishlist(item.product._id))
                            )
                          }
                          className="text-xs text-red-500 cursor-pointer hover:underline"
                        >
                          {auth.token ? 'Remove' : 'Require authentication'}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
          <div className="relative">
            <div className="relative">
              <AiOutlineShoppingCart
                onClick={() => setOpenCart(!openCart)}
                className="text-lg cursor-pointer"
              />
              {cart.length > 0 && (
                <div className="absolute -top-2 -right-2 bg-orange-500 rounded-full w-4 h-4 text-white flex items-center justify-center text-xs font-bold">
                  {cart.length}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div
                ref={cartRef}
                className={`${
                  openCart ? 'scale-y-1' : 'scale-y-0'
                } transition-[transform] origin-top absolute w-[330px] bg-white right-0 translate-y-3 rounded-md shadow-xl`}
              >
                <div className="max-h-[250px] overflow-auto hide-scrollbar">
                  {cart.length > 0 &&
                    cart.map((item) => (
                      <div
                        key={`${
                          item.product
                            ? item._id
                            : `${item.name}-${item.color}-${item.size}`
                        }`}
                        className="font-opensans text-black flex items-center p-3"
                      >
                        <div className="w-20 h-24 rounded-md border border-gray-300 flex items-center justify-center p-2">
                          <img
                            src={
                              item.product ? item.product.images[0] : item.image
                            }
                            alt={item.product ? item.product.name : item.name}
                          />
                        </div>
                        <div className="w-full ml-3">
                          <div className="flex items-center gap-5">
                            <h2 className="font-oswald text-lg tracking-wide">
                              {item.product ? item.product.name : item.name}
                            </h2>
                            <p className="text-sm bg-gray-200 rounded-md px-2 py-1">
                              {item.size}
                            </p>
                            <div
                              className="w-4 h-4 outline outline-2 outline-gray-300 outline-offset-2 rounded-full"
                              style={{ background: item.color }}
                            />
                          </div>
                          <p className="mt-1 mb-2 text-sm">
                            {numberFormatter(
                              item.product
                                ? item.product.price -
                                    (item.product.discount *
                                      item.product.price) /
                                      100
                                : parseInt(item.price)
                            )}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              <div
                                onClick={() =>
                                  handleChangeQty(
                                    'decrease',
                                    item.product ? item.product._id : item._id,
                                    item.color,
                                    item.size,
                                    item.qty
                                  )
                                }
                                className="w-6 h-6 rounded-full text-white font-bold flex items-center justify-center bg-[#3552DC] cursor-pointer hover:bg-[#122DB0] transition-[background]"
                              >
                                -
                              </div>
                              <input
                                type="text"
                                value={item.qty}
                                disabled
                                className="w-[40px] rounded-md bg-gray-100 border border-gray-300 text-center text-sm"
                              />
                              <div
                                onClick={() =>
                                  handleChangeQty(
                                    'increase',
                                    item.product ? item.product._id : item._id,
                                    item.color,
                                    item.size,
                                    item.qty
                                  )
                                }
                                className="w-6 h-6 rounded-full text-white font-bold flex items-center justify-center bg-[#3552DC] cursor-pointer hover:bg-[#122DB0] transition-[background]"
                              >
                                +
                              </div>
                            </div>
                            <IoMdTrash
                              onClick={() =>
                                handleDeleteItem({
                                  productId: item.product
                                    ? item.product._id
                                    : item._id,
                                  productSize: item.size,
                                  productColor: item.color,
                                })
                              }
                              className="text-red-500 text-xl cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <div>
                  <div className="font-opensans text-black px-3 py-2 border-t border-gray-300 flex items-center justify-between">
                    <h1 className="text-sm">Total Price</h1>
                    <p className="text-sm font-bold">
                      {numberFormatter(
                        cart.reduce(
                          (acc, item) =>
                            acc +
                            (item.product
                              ? (item.product.price -
                                  (item.product.discount * item.product.price) /
                                    100) *
                                item.qty
                              : parseInt(item.price) * item.qty),
                          0
                        )
                      )}
                    </p>
                  </div>
                  <div className="px-3 pt-2 pb-3 flex items-center justify-end">
                    <button
                      onClick={handleClickCheckout}
                      className="text-sm rounded-md px-3 py-2 transition-[background] bg-[#3552DC] hover:bg-[#122DB0]"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <SearchModal
        navbarSearchRef={navbarSearchRef}
        openNavbarSearch={openNavbarSearch}
        setOpenNavbarSearch={setOpenNavbarSearch}
      />

      <AuthenticationModal
        authenticationRef={authenticationRef}
        openAuthenticationModal={openAuthenticationModal}
        setOpenAuthenticationModal={setOpenAuthenticationModal}
      />
    </>
  );
};

export default Navbar;
