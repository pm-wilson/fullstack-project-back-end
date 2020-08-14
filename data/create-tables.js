const client = require('../lib/client');
const { getEmoji } = require('../lib/emoji.js');

// async/await needs to run in a function
run();

async function run() {

  try {
    // initiate connecting to db
    await client.connect();

    // run a query to create tables
    await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(256) NOT NULL,
                hash VARCHAR(512) NOT NULL
            );
            CREATE TABLE agents (
                id SERIAL PRIMARY KEY,
                agent_name VARCHAR(256) NOT NULL,
                agent_phone CHAR(10) NOT NULL,
                agent_email VARCHAR(256) NOT NULL
            );
            CREATE TABLE destinations (
                id SERIAL PRIMARY KEY NOT NULL,
                country VARCHAR(90) NOT NULL,
                city VARCHAR(90) NOT NULL,
                flight_hours INTEGER NOT NULL,
                need_passport BOOLEAN NOT NULL,
                map_img VARCHAR(512) NOT NULL,
                user_id INTEGER NOT NULL REFERENCES users(id),
                agent_id INTEGER NOT NULL REFERENCES agents(id)
            );
        `);

    console.log('create tables complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}
