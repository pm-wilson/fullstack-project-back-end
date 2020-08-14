const client = require('../lib/client');
// import our seed data:
const destinations = require('./destinations.js');
const usersData = require('./users.js');
const agentData = require('./agents.js');
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
      agentData.map(agent => {
        return client.query(`
                      INSERT INTO agents (agent_name, agent_phone, agent_email)
                      VALUES ($1, $2, $3)
                      RETURNING *;
                  `,
        [agent.agent_name, agent.agent_phone, agent.agent_email]);
      })
    );

    await Promise.all(
      destinations.map(destination => {
        return client.query(`
                    INSERT INTO destinations (country, city, flight_hours, need_passport, map_img, user_id, agent_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7);
                `,
        [destination.country, destination.city, destination.flight_hours, destination.need_passport, destination.map_img, destination.user_id, destination.agent_id]);
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
