const userRouter = require('./User');
const image = require('./imges')
module.exports = (app) => {
    app.use('/user', userRouter);
    app.use('/imges', image);


};
