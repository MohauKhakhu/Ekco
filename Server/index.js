import express from "express"
import mysql from "mysql"
import cors from "cors"
import bodyParser from "body-parser"



const app = express()

const PORT = 3308;

const USERNAME = 'admin';
const PASSWORD = '1234';

app.use(cors());
app.use(bodyParser.json());


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'ekco_assessment'
});

app.get("/", (req,res)=>{
    res.json("hello")
})
app.listen(8800 , ()=>{
    console.log("connected 1")
})
db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === USERNAME && password === PASSWORD) {
    res.json({ status: 'success' });
  } else {
    res.status(401).json({ status: 'error', message: 'Invalid credentials' });
  }
});

app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post('/users', (req, res) => {
  const { name, date_of_birth, occupation, gender, date_added } = req.body;
  db.query('INSERT INTO users SET ?', { name, date_of_birth, occupation, gender, date_added }, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ id: result.insertId, ...req.body });
  });
});

app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const userData = req.body;
  db.query('UPDATE users SET ? WHERE id = ?', [userData, id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'User updated' });
  });
});

app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'User deleted' });
  });
});

