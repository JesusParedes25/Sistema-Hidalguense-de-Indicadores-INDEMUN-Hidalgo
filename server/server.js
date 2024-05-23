const express = require('express');
const { Pool } = require('pg');
const wkx = require('wkx');
const cors = require('cors');
const app = express();
const port = 5000;

// Habilitar CORS para todas las rutas
app.use(cors());

// Configura la conexión a la base de datos
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'INDEMUN',
  password: 'sigeh2024',
  port: 5432,
});

// Endpoint para obtener datos de la tabla estructura
app.get('/indicadores', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM estructura');
    const rows = result.rows.map(row => {
      const geomBuffer = Buffer.from(row.geom, 'hex');
      const geom = wkx.Geometry.parse(geomBuffer).toGeoJSON();
      return {
        ...row,
        geom: geom
      };
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Endpoint para obtener datos de la tabla indicadores_modulo_2023
app.get('/indicadores_modulo_2023', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM indicadores_modulo_2023');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Endpoint para obtener datos de la tabla de totales_2023
app.get('/totales_2023', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM totales_2023');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Endpoint básico
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
