const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

const fakeUser = {
  id: 1,
  email: 'jon@arbuckle.net',
  hash: '342jk43',
};

app.get('/destinations/:id', async(req, res) => {
  const destinationId = req.params.id;
  const data = await client.query(`SELECT * from destinations where id=${destinationId}`);

  res.json(data.rows);
});

app.get('/destinations', async(req, res) => {
  const data = await client.query('SELECT * from destinations');

  res.json(data.rows);
});

app.post('/destinations', async(req, res) => {
  const newDestination = {
    country: req.body.country,
    city: req.body.city,
    flight_hours: req.body.flight_hours,
    need_passport: req.body.need_passport,
  };

  const data = await client.query( `
  INSERT INTO destinations(country, city, flight_hours, need_passport, user_id)
  VALUES($1, $2, $3, $4, $5)
  RETURNING *
  `, [newDestination.country, newDestination.city, newDestination.flight_hours, newDestination.need_passport, fakeUser.id]);

  res.json(data.rows);
});

app.use(require('./middleware/error'));

module.exports = app;
