import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Qna from './Qna';

const QnaDisplay = ({ item, id }) => {
  const [reply, setReply] = useState([]);
  const [allCorrespondingReply, setAllCorrespondingReply] = useState([]);
  const [replyFromComment, setReplyFromComment] = useState([]);
  const [next, setNext] = useState(2);

  const { qna } = useSelector((state) => state);

  useEffect(() => {
    const commentWithReply = qna.data.filter((item) => item.reply);
    setReply(commentWithReply);
  }, [qna]);

  useEffect(() => {
    const correspondingReply = reply.filter(
      (newReply) => newReply.reply === item._id
    );
    setAllCorrespondingReply(correspondingReply);
    setReplyFromComment(
      correspondingReply.slice(correspondingReply.length - next)
    );
  }, [reply, item, next]);

  return (
    <Qna item={item} id={id}>
      <div className="ml-[50px]">
        {replyFromComment.map((itemReply) => (
          <QnaDisplay key={item._id} item={itemReply} />
        ))}
        {allCorrespondingReply.length - next > 0 ? (
          <div
            onClick={() => setNext(allCorrespondingReply.length)}
            className="cursor-pointer text-blue-600 underline text-sm w-fit mb-4"
          >
            See more
          </div>
        ) : (
          allCorrespondingReply.length > 2 && (
            <div
              onClick={() => setNext(2)}
              className="cursor-pointer text-sm text-blue-600 underline w-fit mb-4"
            >
              Hide
            </div>
          )
        )}
      </div>
    </Qna>
  );
};

export default QnaDisplay;
