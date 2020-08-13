const client = require('../lib/client');
// import our seed data:
const destinations = require('./destinations.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      
    const user = users[0].rows[0];

    await Promise.all(
      destinations.map(destination => {
        return client.query(`
                    INSERT INTO destinations (id, country, city, flight_hours, need_passport)
                    VALUES ($1, $2, $3, $4, $5);
                `,
        [destination.id, destination.country, destination.city, destination.flight_hours, destination.need_passport]);
      })
    );

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
