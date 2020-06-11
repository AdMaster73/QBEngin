import * as functions from 'firebase-functions';
const admin = require('firebase-admin');
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { routesConfig } from './users/routes-config'
admin.initializeApp();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: true }));
routesConfig(app)
export const api = functions.https.onRequest(app);