const reddit = require('./app.js');
const CLIENT_ID = 'vIr0SlnbJqv5Yg';
const CLIENT_SECRET = 'kPJTSoiCX_fRBE1TrUHefN5IVtc';

var test = new reddit(CLIENT_ID, CLIENT_SECRET);
test.auth();