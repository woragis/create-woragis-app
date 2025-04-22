const express = require('express')
const serverless = require('serverless-http')
const userController = require('./controllers/usersController')
const platformController = require('./controllers/platformController')
const verifyToken = require('./middlewares/authMiddleware') // Importe o middleware

const app = express()

app.use(express.json())

// Rotas públicas
app.post('/users', userController.createUser)
app.post('/login', userController.loginUser)
app.post('/confirm-email', userController.confirmUserEmail)

// Rotas protegidas
app.get('/users', verifyToken, userController.getAllUsers)
app.get('/services', verifyToken, platformController.getServices)
app.put('/update-city-status', verifyToken, platformController.updateCityStatus) // Nova rota
app.put(
  '/update-service-status',
  verifyToken,
  platformController.updateServiceStatus
)
app.put(
  '/update-city-time',
  verifyToken,
  platformController.handleUpdateTimeCity
)

app.put(
  '/update-all-cities-status',
  verifyToken,
  platformController.handleUpdateStatusAllCities
)

app.put(
  '/update-emergency-status-city',
  verifyToken,
  platformController.updateCityEmergencyStatus
)

app.put(
  '/update-emergency-time-city',
  verifyToken,
  platformController.handleUpdateTimeEmergencyCity
)

app.put(
  '/update-status-neighborhood',
  verifyToken,
  platformController.handleToggleNeighborhoodStatus
)

app.post('/neighborhood', verifyToken, platformController.createNewNeighborhood)

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,POST,PUT,DELETE')
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  next()
})

exports.handler = serverless(app)
