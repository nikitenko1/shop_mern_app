import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const SocketClient = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const audioRef = useRef();

  useEffect(() => {
    if (auth.token) {
      socket.emit('joinUser', auth.user);
    }
  }, [auth]);

  useEffect(() => {
    if (!socket) return;

    socket.on('createQnaToClient', (data) => {
      dispatch({
        type: 'qna/create',
        payload: data,
      });
    });

    return () => socket.off('createQnaToClient');
  }, [dispatch]);

  useEffect(() => {
    if (!socket) return;

    socket.on('likeQnaToClient', (data) => {
      dispatch({
        type: 'qna/like',
        payload: data,
      });
    });

    return () => socket.off('likeQnaToClient');
  }, [dispatch]);

  useEffect(() => {
    if (!socket) return;

    socket.on('unlikeQnaToClient', (data) => {
      dispatch({
        type: 'qna/unlike',
        payload: data,
      });
    });

    return () => socket.off('unlikeQnaToClient');
  }, [dispatch]);

  useEffect(() => {
    if (!socket) return;

    socket.on('createReviewToClient', (data) => {
      dispatch({
        type: 'review/create',
        payload: data,
      });
    });

    return () => socket.off('createReviewToClient');
  }, [dispatch]);

  useEffect(() => {
    if (!socket) return;

    socket.on('likeReviewToClient', (data) => {
      dispatch({
        type: 'review/like',
        payload: data,
      });
    });

    return () => socket.off('likeReviewToClient');
  }, [dispatch]);

  useEffect(() => {
    if (!socket) return;

    socket.on('unlikeReviewToClient', (data) => {
      dispatch({
        type: 'review/unlike',
        payload: data,
      });
    });

    return () => socket.off('unlikeReviewToClient');
  }, [dispatch]);

  useEffect(() => {
    if (!socket) return;

    socket.on('createNotificationToClient', (data) => {
      dispatch({
        type: 'notification/create',
        payload: data,
      });
      audioRef.current?.play();
    });

    return () => socket.off('createNotificationToClient');
  }, [dispatch]);

  return <div></div>;
};

export default SocketClient;
