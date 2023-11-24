// const './middleware/auth.middleware');

import createError from 'http-errors';
import cookieParser  from 'cookie-parser';
import bodyParser  from 'body-parser';
// const {corsFilter} = require('./config/corsFilter')
import swaggerUi  from 'swagger-ui-express'

// import swaggerRender from './utils/swagger.ts'


// import session from 'express-session'

;
import path  from 'path'

import issueRouter from './routes/issuer.ts'


import express from 'express'
import {
  AgentRouter,
  ApiSchemaRouter,
  MessagingRouter,
  RequestWithAgentRouter,
  WebDidDocRouter,
} from '@veramo/remote-server'

const exposedMethods = [  //...agent.availableMethods(),
  'didManagerGetOrCreate',
  'didManagerGet',
  'keyManagerSign',
  'createVerifiableCredential',
  'createVerifiablePresentation',
]
const basePath = '/agent'
const messagingPath = '/messaging'
const schemaPath = '/open-api.json'

const agentRouter = AgentRouter({
  exposedMethods,
})

const schemaRouter = ApiSchemaRouter({
  basePath,
  exposedMethods,
})







const app = express();

// var sessionStore = new session.MemoryStore();
// app.use(session({
//   secret: 'cookie-secret-key',
//   resave: false,
//   saveUninitialized: true,
//   store: sessionStore
// }))

app.use(express.static('public'))

// const publicDir = path.join(__dirname,'../public');

app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());



app.use('/api/issuer', issueRouter);


const messagingRouter = MessagingRouter({
  metaData: { type: 'incoming' },
  save: false,
})


// app.use(RequestWithAgentRouter({ agent }))
app.use(basePath, agentRouter)
app.use(schemaPath, schemaRouter)
app.use(messagingPath, messagingRouter)
app.use(WebDidDocRouter({}))

const PORT = 3002
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))


export default app