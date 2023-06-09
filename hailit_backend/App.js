const express = require('express');
const morgan = require('morgan')
const helmet = require('helmet');
const bodyParser = require('body-parser')
const session = require('express-session')
require('dotenv').config();
const PORT = process.env['PORT']||5000;
const SESSION_SECRET = process.env['SESSION_SECRET']
const cors = require('cors')

const app = new express();
app.use(cors())
app.use(helmet());
app.use(morgan('tiny'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

const v1Routes = [
    { path: '/api/v1/carDriver', route: require('./src/v1/routes/carDriver.routes').router },
    { path: '/api/v1/customer', route: require('./src/v1/routes/customer.routes').router },
    { path: '/api/v1/motorRider', route: require('./src/v1/routes/motorRider.routes').router },
    { path: '/api/v1/order', route: require('./src/v1/routes/order.routes').router },
    { path: '/api/v1/user', route: require('./src/v1/routes/user.routes').router },
    { path: '/api/v1/vehicle', route: require('./src/v1/routes/vehicle.routes').router }
  ];
  
  for (const v1Route of v1Routes) {
    app.use(v1Route.path, v1Route.route);
  }
  

app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`)
})