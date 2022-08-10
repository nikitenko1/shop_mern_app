require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./utils/connectDB');
const socketServer = require('./utils/socketServer');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
const app = express();

// Cloud Mongodb Atlas
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(morgan('dev'));

const http = createServer(app);
const io = new Server(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socketServer(socket);
});

app.use('/api/v1/auth', require('./routes/auth.route'));
app.use('/api/v1/banner', require('./routes/banner.route'));
app.use('/api/v1/brand', require('./routes/brand.route'));
app.use('/api/v1/cart', require('./routes/cart.route'));
app.use('/api/v1/category', require('./routes/category.route'));
app.use('/api/v1/checkout', require('./routes/checkout.route'));
app.use('/api/v1/dashboard', require('./routes/dashboard.route'));
app.use('/api/v1/discount', require('./routes/discount.route'));
app.use('/api/v1/notification', require('./routes/notification.route'));
app.use('/api/v1/newsletter', require('./routes/newsletter.route'));
app.use('/api/v1/product', require('./routes/product.route'));
app.use('/api/v1/review', require('./routes/review.route'));
app.use('/api/v1/qna', require('./routes/qna.route'));
app.use('/api/v1/subscriber', require('./routes/subscriber.route'));
app.use('/api/v1/user', require('./routes/user.route'));
app.use('/api/v1/wishlist', require('./routes/wishlist.route'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

http.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${process.env.PORT}.`)
);

module.exports = app;
