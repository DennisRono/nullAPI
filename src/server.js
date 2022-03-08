const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const logger = require('morgan');
const PORT = process.env.PORT || 5000;

//routes
const authRoute = require('./routes/auth');
const homeRoute = require('./routes/home');
const blogsRoute = require('./routes/blogs');
const imageuploadRoute = require('./routes/upload');
const profileRoute = require('./routes/profile');
const subscribeRoute = require('./routes/subscribe');
const contactRoute = require('./routes/contact');

//middlewares
app.use(cors({
  origin: "*"
}))
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use('/auth', authRoute);
app.use("/", homeRoute);
app.use("/blogs", blogsRoute);
app.use("/imageupload", imageuploadRoute);
app.use("/profile", profileRoute);
app.use("/subscribe", subscribeRoute);
app.use("/contact", contactRoute);

app.listen(PORT, ()=>{console.log(`Server is running on port: ${PORT}`);});