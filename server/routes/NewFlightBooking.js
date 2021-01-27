const express = require('express');
const router = express.Router();



const { listNewFlightBooking } = require('../controllers/NewFlightBooking')

//  ....................... Route  ...................
router.post('/NewFlightBooking', listNewFlightBooking);


module.exports = router;
