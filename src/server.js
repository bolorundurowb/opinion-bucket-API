/**
 * Created by bolorundurowb on 11/11/16.
 */

import cors from 'cors';
import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import routes from './routes/Routes';
import config from './config/Config';
import logger from './config/Logger';

// Connect to MongoDB
mongoose.connect(config.database);

// use default ES6 promise implementation
mongoose.promise = Promise;

// initialize an express object
const server = express();

server.use(cors());

// create a router object
const router = express.Router();

// direct the router to our routes first
routes.route(router);

// log requests with morgan
server.use(morgan('dev'));

// parse the payload
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// prefix the path with /api/v{version}
server.use('/api/v1', router);

// handle unmatched routes
server.use((req, res, next) => {
  res.status(501).send({
    status: 'failed',
    message: 'This API doesn\'t support that function'
  });
  next();
});

// set the API port
const port = process.env.PORT || 4321;

// start the server
server.listen(port);

// indicate server status
logger.log(`Server started on port: ${port}`);

// expose server to test
export default server;

