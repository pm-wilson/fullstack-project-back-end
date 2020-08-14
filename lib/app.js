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
    message: `in this protected route, we get the user's id like so: ${req.userId}`
  });
});

const fakeUser = {
  id: 1,
  email: 'jon@arbuckle.net',
  hash: '342jk43',
};

app.get('/destinations/:id', async(req, res) => {
  try {
    const destinationId = req.params.id;
    const data = await client.query(`
      SELECT d.id,  country, city, flight_hours, need_passport, map_img, a.agent_name, a.agent_phone, a.agent_email
      FROM destinations AS d
      JOIN agents AS a
      ON d.agent_id=a.id
      WHERE d.id=$1
    `, [destinationId]);

    res.json(data.rows[0]);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/destinations', async(req, res) => {
  try {
    const data = await client.query(`
      SELECT d.id, country, city, flight_hours, need_passport, map_img, a.agent_name, a.agent_phone, a.agent_email
        FROM destinations AS d
        JOIN agents AS a
        ON d.agent_id = a.id
    `);

    res.json(data.rows);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/agents', async(req, res) => {
  try {
    const data = await client.query('SELECT * from agents');
  
    res.json(data.rows);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/destinations', async(req, res) => {
  try {
    const newDestination = {
      country: req.body.country,
      city: req.body.city,
      flight_hours: req.body.flight_hours,
      need_passport: req.body.need_passport,
      map_img: req.body.map_img,
      agent_id: req.body.agent_id,
    };

    const data = await client.query(`
    INSERT INTO destinations(country, city, flight_hours, need_passport, map_img, user_id, agent_id)
    VALUES($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `, [newDestination.country, newDestination.city, newDestination.flight_hours, newDestination.need_passport, newDestination.map_img, fakeUser.id, newDestination.agent_id]);
  
    res.json(data.rows);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/destinations/:id', async(res, req) => {
  const destinationId = req.params.id;

  try {
    const updatedDestination = {
      country: req.body.country,
      city: req.body.city,
      flight_hours: req.body.flight_hours,
      need_passport: req.body.need_passport,
      map_img: req.body.map_img,
      agent_id: req.body.agent_id,
    };

    const data = await client.query(`
      UPDATE destinations
        SET country=$1, city=$2, flight_hours=$3, need_passport=$4, map_img=$5, agent_id=$6
        WHERE destinations.id=$7
        RETURNING *
    `, [updatedDestination.country, updatedDestination.city, updatedDestination.flight_hours, updatedDestination.need_passport, updatedDestination.map_img, updatedDestination.agent_id, destinationId]);

    res.json(data.rows[0]);
  } catch(e) {
    res.statusCode(500).json({ error: e.message });
  }
});

app.delete('/destinations/:id', async(req, res) => {
  try {
    const destinationId = req.params.id;
    const data = await client.query('DELETE FROM destinations WHERE destinations.id=$1;', [destinationId]);

    res.json(data.rows[0]);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.use(require('./middleware/error'));

module.exports = app;
