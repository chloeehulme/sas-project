const express = require('express');
const cors = require('cors');
const app = express();
const { Pool, Client } = require('pg');

app.use(cors());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sas_project',
  password: 'postgreSQL',
  port: 5432
});

// toggle light by ID, if id=0 toggle all
// write to db light_on column (true or false)
app.get('/toggle/:id', (req, res) => {
    const id = req.params.id;

    if (id == 0) {
        console.log("Master Switch toggled")
    }
    else pool.query('SELECT light_on FROM lights WHERE id = $1', [id], (err, result1) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'An error occurred' });
      } else {
            if (result1.rows[0].light_on) {
                pool.query('UPDATE lights SET light_on=false WHERE id = $1 RETURNING *', [id], (err, result2) => {
                    if (err) {
                        console.error('Error executing query:', err);
                        res.status(500).json({ error: 'An error occurred' });
                    }
                    else {
                        console.log(result2.rows)
                        res.status(200).json(result2.rows);
                    }
                });
            }
            else {
                pool.query('UPDATE lights SET light_on=true WHERE id = $1 RETURNING *', [id], (err, result2) => {
                    if (err) {
                        console.error('Error executing query:', err);
                        res.status(500).json({ error: 'An error occurred' });
                    }
                    else {
                        console.log(result2.rows)
                        res.status(200).json(result2.rows);
                    }
                });
            }
        }
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
