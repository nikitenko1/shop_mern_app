const Qna = require('./../models/Qna');
const app = require('../server');
const { createServer } = require('http');
const { Server } = require('socket.io');

const qnaCtrl = {
  createQna: async (req, res) => {
    const http = createServer(app);
    const io = new Server(http, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    try {
      const { content, reply, product } = req.body;
      if (!content || !product)
        return res
          .status(400)
          .json({ msg: 'Please provide content and product id.' });

      const newQna = new Qna({
        content,
        reply,
        user: req.user._id,
        product,
      });

      const qnaData = {
        ...newQna._doc,
        user: req.user,
        likes: [],
      };

      io.to(product).emit('createQnaToClient', qnaData);

      await newQna.save();

      return res.status(200).json({
        msg: `New QNA content has been created successfully.`,
        qna: newQna,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getQna: async (req, res) => {
    try {
      const qnas = await Qna.find({ product: req.params.product }).populate(
        'user'
      );
      return res.status(200).json({ qnas });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  likeQna: async (req, res) => {
    const http = createServer(app);
    const io = new Server(http, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    try {
      const qna = await Qna.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { likes: req.user._id },
        },
        { new: true }
      );
      if (!qna)
        return res
          .status(404)
          .json({ msg: `Qna with ID ${req.params.id} not found.` });

      io.to(req.body.product).emit('likeQnaToClient', {
        id: req.params.id,
        user: req.user._id,
      });

      return res.status(200).json({ msg: 'Qna liked.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  unlikeQna: async (req, res) => {
    const http = createServer(app);
    const io = new Server(http, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    try {
      const qna = await Qna.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { likes: req.user._id },
        },
        { new: true }
      );
      if (!qna)
        return res
          .status(404)
          .json({ msg: `Qna with ID ${req.params.id} not found.` });

      io.to(req.body.product).emit('unlikeQnaToClient', {
        id: req.params.id,
        user: req.user._id,
      });

      return res.status(200).json({ msg: 'Qna unliked.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = qnaCtrl;
