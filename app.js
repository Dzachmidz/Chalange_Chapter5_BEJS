require("dotenv").config();
var express = require('express');
var logger = require('morgan');
var app = express();
// const { PORT = 3000 } = process.env;
const endpointV1 = require("./routes/endpointV1");


app.use(logger('dev'));
app.use(express.json());

app.use('/api/v1', endpointV1);
// app.use('/api/v1/users', require('./routes/users.routes'));
// app.use('/api/v1/accounts', require('./routes/accounts.routes'));
// app.use('/api/v1/transactions', require('./routes/transactions.routes'));




// // 404 error handling
// app.use((req, res, next) => {
//   res.status(404).json({
//     status: false,
//     message: "Not Found!",
//     data: null,
//   });
// });

// //500 error handling
// app.use((req, res, next) => {
//   console.log(err);
//   res.status(500).json({
//     status: false,
//     message: "Internal Server Error!", 
//     data: err.message
//   });
// });

// app.listen(PORT, () => console.log("Listening on port", PORT));

module.exports = app;

