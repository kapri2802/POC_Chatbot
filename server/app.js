const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);




const app = express()
const port = 3003


const newFlightBookingRoutes = require('./routes/NewFlightBooking');
const updateFlightBookingRoutes = require('./routes/UpdateFlightBooking');



// .................................. Middlewares .............................................
app.use(cors());
app.use(
  bodyParser.xml({
    limit: "1MB", // Reject payload bigger than 1 MB
    xmlParseOptions: {
      normalize: true, // Trim whitespace inside text nodes
      normalizeTags: true, // Transform tags to lowercase
      explicitArray: false, // Only put nodes in array if >1
    },
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());




// .............................. Setting up all routes  ........................................
app.use('/api', newFlightBookingRoutes);
app.use('/api', updateFlightBookingRoutes);




// .................................. Starting the Server .....................................
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`)
})