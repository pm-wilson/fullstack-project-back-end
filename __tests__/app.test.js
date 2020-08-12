require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  beforeAll(done => {
    return client.connect(done);
  });

  beforeEach(() => {
    // TODO: ADD DROP SETUP DB SCRIPT
    execSync('npm run setup-db');
  });

  afterAll(done => {
    return client.end(done);
  });

  test('returns destinations', async() => {

    const expectation = [
      {
        id: 1,
        country: 'Costa Rica',
        city: 'San Jose',
        flight_hours: 14,
        need_passport: 1,
      },
      {
        id: 2,
        country: 'New Zealand',
        city: 'Auckland',
        flight_hours: 20,
        need_passport: 1,
      },
      {
        id: 3,
        country: 'Japan',
        city: 'Tokyo',
        flight_hours: 31,
        need_passport: 1,
      },
      {
        id: 4,
        country: 'Switzerland',
        city: 'Zurich',
        flight_hours: 15,
        need_passport: 1,
      },
      {
        id: 5,
        country: 'United States',
        city: 'Honolulu',
        flight_hours: 7,
        need_passport: 0,
      }
    ];

    const data = await fakeRequest(app)
      .get('/destinations')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(data.body).toEqual(expectation);
  });
});
