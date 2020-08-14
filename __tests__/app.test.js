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
        country: 'Costa Rica',
        city: 'San Jose',
        flight_hours: 14,
        need_passport: true,
        map_img: 'https://www.google.com/maps/vt/data=WvC9tjJphZSJMkUw5O38NNIlm21Rh5iLYfnAisidwetEhAnuGsX5eJT3d5gnGhf8KMhtGkx94KPQMu_ju79mtBXODtdTs3GJWsbNtc3BH0A1WW6tSysUPpNsaacENrNTeqS_iY6kW1hnBNd1riKq_iB-gmZAKErBLhEu8vVnw9fzRJXHQYYaPxK3H85dZgymC0jr6W_TCD-TPJ-ABfXcnCQH9Z2Orl1Ehb6iUoySlg_kKUjDRKgcaBHMaMw8ynkuQQ',
        user_id: 1,
        agent_id: 1,
      },
      {
        country: 'New Zealand',
        city: 'Auckland',
        flight_hours: 20,
        need_passport: true,
        map_img: 'https://www.google.com/maps/vt/data=LfqYtvWlkPeZ4cn155jZITAhATbTd8da7JD_l_xDvKkj6so0XX8iFJw_tDdnjdAI8b0BV9mj_vzl3QJS-MO_Mn1fEcvDWey1dBlADoxBHxE91D_Qzq5MEOt-8zU4uIiAebrCTtxZVmuRcu899EYpLTz7VwCeVPcti-j9PNiooXq5ySXp4pcsbv-aigyGJcWjjG5bjrhpsGl7CcKJY9RaA069T8ARM0P0y9lLQEnRE24ZXwXS8osxQBV8QfQY2dk1rQ',
        user_id: 1,
        agent_id: 2,
      },
      {
        country: 'Japan',
        city: 'Tokyo',
        flight_hours: 31,
        need_passport: true,
        map_img: 'https://www.google.com/maps/vt/data=pAhODf9-eEB7cyQaZfb_uLSG8iYQPQ57AtSvG6fZwHCEut0hGZnB_WUeDT1lXHr2bgizMBFaaFWKBl2Pal6PoC-2su5ioFGj1U6xSD3CG4BLpOX1tsogimqE6vV6WShWN-98sqb2dPc3BkWtEV72Wqk4rQQiP8VVpFx1QPZ08ow-r89mt5wZCXes04jH07tb9iduEhsuutEiAUwgNY-v1BN-D3VwH37KPk5BUHnrr2tszjQrzHcu2_qvPgCO24hTYw',
        user_id: 1,
        agent_id: 1,
      },
      {
        country: 'Switzerland',
        city: 'Zurich',
        flight_hours: 15,
        need_passport: true,
        map_img: 'https://www.google.com/maps/vt/data=7W6VDNHkZI0DmCvsyPWwTNKPXzSq0H392_2r-lh2bT4W-kTrICOHHFU7LmKogOtVVxSbJcnQriPB0ovJ1i9zzadxS5qYnUYBd-QydQOCF8IZxIHnzpoqplPlR7aPrKTmnrJ8P9AehRDVzwpjGhYSXkPkH95tXSZH-PgdLhhpLjjcSD8mBgAoeVa0XMwXu8lOeMIpJCnbv4JYDoc3L-i9WxSJ8ISQt1y38J7ASKZWp304Xjkr0OUs6tXJClL5RlNN4A',
        user_id: 1,
        agent_id: 2,
      },
      {
        country: 'United States',
        city: 'Honolulu',
        flight_hours: 7,
        need_passport: false,
        map_img: 'https://www.google.com/maps/vt/data=CHIgi4BRcaeOTfpNRFD1UfiClvgsPlGLlcLCxipeQns6O648dA84tuXhJGvauJqUTsqKb8-Aoz8NCxI4_o8H41yKRbaCXZhvg0bbDxt3_X4tl5JsZGWklgqxWkQVD50e7v9wUJKhJtiGuke7fierKP-0ICusVuiGi9uijluP8Fm2l6CHxy5Tb4j42-Dw01y7GT0HF4cUQwjCmAWUWNTvX2kY-9MWiZv73OHbIxOLycYLqgBw0YKLGSP9X7co7pEQkQ',
        user_id: 1,
        agent_id: 1,
      }
    ];

    const data = await fakeRequest(app)
      .get('/destinations')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(data.body).toEqual(expectation);
  });
});
