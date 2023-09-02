const express = require('express');
const cors = require('cors');
const mqtt = require('mqtt')

const app = express();
const server = mqtt.connect("mqtt://broker.hivemq.com:1883")
const { Pool, Client } = require('pg');

app.use(cors());

// Postgres connect
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sas_project',
  password: 'postgreSQL',
  port: 5432
});

// mqtt connect
server.on('connect', () => {
    console.log('mqtt connected');

    // Gets every value in light_on column to initialise lights in interface onload (useEffect) function
    app.get('/get-status', (req, res) => {
        pool.query('SELECT * FROM lights', (err, result1) => {
            if (err) {
                res.status(500).send('Error executing query');
            } else {
                res.status(200).json(result1.rows);
            }
        });
    });

    // Toggles light on or off by light id in database then publishes mqtt message to related topic
    app.get('/toggle/:id', (req, res) => {
        const id = req.params.id;

        pool.query('SELECT light_on FROM lights WHERE id = $1', [id], (err, result1) => {
        if (err) {
            res.status(500).json({ error: 'An error occurred' });
        } else {
                if (result1.rows[0].light_on) {
                    pool.query('UPDATE lights SET light_on=false WHERE id = $1 RETURNING *', [id], (err, result2) => {
                        if (err) {
                            res.status(500).json({ error: 'An error occurred' });
                        }
                        else {
                            res.status(200).json(result2.rows);
                            var topic = `/lights/${id}/lightOn`
                            var message = "false"
                            server.publish(topic, message);
                        }
                    });
                }
                else {
                    pool.query('UPDATE lights SET light_on=true WHERE id = $1 RETURNING *', [id], (err, result2) => {
                        if (err) {
                            res.status(500).json({ error: 'An error occurred' });
                        }
                        else {
                            res.status(200).json(result2.rows);
                            var topic = `/lights/${id}/lightOn`
                            var message = "true"
                            server.publish(topic, message);
                        }
                    });
                }
            }
        });
    });

    // Toggles all lights on then publishes mqtt message to related topic
    app.get('/toggle/master/on', (req, res) => {
        pool.query('SELECT MAX(id) as max_id FROM lights', (err, result1) => {
            if (err) {
                res.status(500).send('Error executing query');
            } else {
                const maxId = result1.rows[0].max_id;
                for (let i = 1; i <= maxId; i++){
                    pool.query('UPDATE lights SET light_on=true WHERE id = $1', [i], (err, result2) => {
                        if (err) {
                            res.status(500).json({ error: 'An error occurred' });
                        }
                    });
                }
                res.status(200).json(maxId);
                var topic = `/lights/masterOn`
                var message = "true"
                server.publish(topic, message);
            }
        });
    });

    // Toggles all lights off then publishes mqtt message to related topic
    app.get('/toggle/master/off', (req, res) => {
        pool.query('SELECT MAX(id) as max_id FROM lights', (err, result1) => {
            if (err) {
                res.status(500).send('Error executing query');
            } else {
                const maxId = result1.rows[0].max_id;
                for (let i = 1; i <= maxId; i++){
                    pool.query('UPDATE lights SET light_on=false WHERE id = $1', [i], (err, result2) => {
                        if (err) {
                            res.status(500).json({ error: 'An error occurred' });
                        }
                    });
                }
                res.status(200).json(maxId);
                var topic = `/lights/masterOn`
                var message = "false"
                server.publish(topic, message);
            }
        });
    });

})

// Server connect
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
