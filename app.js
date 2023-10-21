require("dotenv").config();
const express = require("express");
const app = express();
const endpointV1 = require("./routes/endpointV1");
const swaggerUi = require("swagger-ui-express");
const yaml = require("yaml");
const morgan = require("morgan");
const cors = require('cors');


const fs = require("fs");
const file = fs.readFileSync("./swagger.yaml", "utf8"); 
const swaggerDocument = yaml.parse(file);
const authRouter = require("./routes/auth.routes");


app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/v1", endpointV1);
app.use("/api/v1/auth", authRouter); 
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;

