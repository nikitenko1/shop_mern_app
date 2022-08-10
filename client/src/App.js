import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Alert from './components/global/Alert';
import PageRender from './utils/PageRender';
import Home from './pages/home';
import { refreshToken } from './redux/slices/authSlice';
import SocketClient from './SocketClient';
import CompareModal from './components/modal/CompareModal';
import ReviewModal from './components/modal/ReviewModal';
import io from 'socket.io-client';

const App = () => {
  const dispatch = useDispatch();
  const { compare, review } = useSelector((state) => state);

  useEffect(() => {
    const socket = io('http://localhost:5000');

    return () => socket.close();
  }, [dispatch]);

  useEffect(() => {
    dispatch(refreshToken());
  }, [dispatch]);

  const compareRef = useRef();
  const reviewRef = useRef();

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        compare.isOpen &&
        compareRef.current &&
        !compareRef.current.contains(e.target)
      ) {
        dispatch({
          type: 'compare/open',
          payload: false,
        });
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);
    return () =>
      document.removeEventListener('mousedown', checkIfClickedOutside);
  }, [compare.isOpen, dispatch]);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        review.isOpen &&
        reviewRef.current &&
        !reviewRef.current.contains(e.target)
      ) {
        dispatch({
          type: 'review/open_modal',
          payload: false,
        });
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);
    return () =>
      document.removeEventListener('mousedown', checkIfClickedOutside);
  }, [review.isOpen, dispatch]);

  return (
    <Router>
      <Alert />
      <SocketClient />
      <CompareModal compareRef={compareRef} />
      <ReviewModal reviewRef={reviewRef} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:page" element={<PageRender />} />
        <Route path="/:page/:id" element={<PageRender />} />
      </Routes>
    </Router>
  );
};

export default App;
