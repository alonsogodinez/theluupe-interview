process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const { GraphQLServer } = require('graphql-yoga');
const { MutationValidationErrorType, FieldValidationErrorType, yupMiddleware } = require('graphql-yup-middleware');
const Graceful = require('node-graceful');
const requestId = require('express-request-id');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')

const { log } = require('../shared/lib/logger');
const { schema, context } = require('./graphql');
const { permissionsMiddleware } = require('./graphql/middleware/permissions');
const { nextApp, nextMiddleware } = require('./routers/next');
const { authRouter } = require('./routers/auth');
const prisma = require('./lib/prisma');

Graceful.captureExceptions = true;

const GENERIC_ERROR_MSG =
  'An unknown error has occurred. We’ve sent this issue to our tech team and we’ll investigate what is going on.';
const isDev = process.env.NODE_ENV === 'development';
const port = process.env.PORT || 3000;
const basePaths = {
  gql: '/graphql',
  auth: '/auth',
};
const typeDefs = [MutationValidationErrorType, FieldValidationErrorType];

Graceful.on('exit', async (signal, details) => {
  if (details) {
    log.error('Exception triggered', details);
  }
  log.info(`Received ${signal} - disconnecting from database`);
  return Promise.all([prisma.$disconnect()]);
});


const corsOptions = {
  origin: 'http://localhost:3000', // fow now
  credentials: true
};

async function start() {
  try {
    await nextApp.prepare();
    const middlewares = [permissionsMiddleware, yupMiddleware()];
    const gqlServer = new GraphQLServer({ schema, middlewares, context, typeDefs });
    gqlServer.express.disable('x-powered-by');
    gqlServer.express.enable('trust proxy');
    gqlServer.express.use(requestId());
    gqlServer.express.use(cookieParser())
    gqlServer.express.use(cors(corsOptions))
    gqlServer.express.use(bodyParser.json());
    gqlServer.express.use(basePaths.auth, authRouter);
    // Add Next.js routes to GraphQL server base
    gqlServer.use(nextMiddleware(Object.values(basePaths)));
    await gqlServer.start({
      port,
      endpoint: basePaths.gql,
      subscriptions: isDev ? `${basePaths.gql}/subscriptions` : false,
      playground: isDev ? `${basePaths.gql}/playground` : false,
      formatError: err => {
        console.error('GraphQL error:', err);
        // Redact actual error message from client response
        return err.message || GENERIC_ERROR_MSG;
      },
    });
  } catch (err) {
    log.error('Error starting server:', err);
    process.exit(1);
  }
}

start();
