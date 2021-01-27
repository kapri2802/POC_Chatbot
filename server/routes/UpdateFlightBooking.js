const express = require('express');
const router = express.Router();



const { listUpdateFlightBooking } = require('../controllers/UpdateFlightBooking')

//  ....................... Route  ...................
router.post('/UpdateFlightBooking', listUpdateFlightBooking);


module.exports = router;
