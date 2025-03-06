import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import Pool from 'pg-pool'
import session from 'express-session'
import connectPgSimple from 'connect-pg-simple';
let pool;

const pgSession = connectPgSimple(session)


dotenv.config();
const app = express()



// if u are sending data from client to server with them having different ports wont work cause of seucrity so we have to explicitly allow this
app.use(cors({ 
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PATCH", "PUT"],
  credentials: false
}))

app.use(express.json()); // 
app.use(urlencoded({extended:true}));



app.get('/', function (req, res) {
  res.send('Hello World')
})




const runBackend = async () => {
  // TEMPORARY POOL/CLIENT TO MAKE AnyLogistics Schema
  const tempPool = new Pool({
    database: process.env.DB_DATABASE,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: false,
  });

  const tempClient = await tempPool.connect();
  try {
    // 1. CREATE SCHEMA IF MISSING
    await tempClient.query(
      `CREATE SCHEMA IF NOT EXISTS "${process.env.DB_SCHEMA}";`
    );
    console.log(`Schema '${process.env.DB_SCHEMA}' created/verified`);
  } finally {
    tempClient.release();
    await tempPool.end(); // Destroy temp pool
  }

  // 2. INITIALIZE MAIN POOL WITH SCHEMA ENFORCEMENT
    pool = new Pool({
    database: process.env.DB_DATABASE,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: false,
    max: 20, // set pool max size to 20
    idleTimeoutMillis: 1000, // close idle clients after 1 second
    connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
    maxUses: 7500, // close (and replace) a connection after it has been used 7500 times (see below for discussion)
    //connectionString: `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@localhost:${process.env.DB_PORT}/${process.env.DB_DATABASE}?search_path=${process.env.DB_SCHEMA}`,
  })

  // this makes it anynoe using pool meaning their client would be searching AnyLogisstis
  pool.on('connect', (client) => { 
    client.query(`SET search_path TO "${process.env.DB_SCHEMA}", public`);
  });

  app.use(session({
    store: new pgSession ({
      pool: pool,
      tableName : 'user_sessions',
      schemaName: process.env.DB_SCHEMA,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true, // basically no javascript to access cookie,
      sameSite: 'lax',
      maxAge: 60000 * 60,
    }
  }))

  const { router: userRoutes } = await import('./routes/users.js');
  const { router: testRoutes } = await import('./routes/test.js');
  app.use('/api/users', userRoutes);
  app.use('/api/test', testRoutes); 



  // 4. CREATION ETC DATABASE TABLES
  await setupDatabase(pool);





  app.listen(process.env.PORT, () => {
    console.log(process.env.PORT);
  });


}

// ALL BACKEND CREATE COMMANDS




const setupDatabase = async (pool) => {
  await pool.query(`DROP TABLE IF EXISTS users CASCADE;`);
  await pool.query(`DROP TABLE IF EXISTS clients CASCADE`);
  await pool.query(`DROP TABLE IF EXISTS admins CASCADE`);
  await pool.query(`DROP TABLE IF EXISTS couriers CASCADE`);
  await pool.query(`DROP TABLE IF EXISTS roles CASCADE`);


  await pool.query(`CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(25) NOT NULL UNIQUE CHECK (name IN ('couriers', 'clients', 'admins'))
    );`)

  await pool.query(`CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role_id INT NOT NULL REFERENCES roles(id),
    phone_number VARCHAR(255) NOT NULL
  );`)

  await pool.query(`CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    user_id uuid UNIQUE REFERENCES users(id),
    company_name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    created_at DATE DEFAULT CURRENT_DATE
  );`);

  await pool.query(`CREATE TABLE IF NOT EXISTS couriers (
    id SERIAL PRIMARY KEY,
    user_id uuid UNIQUE REFERENCES users(id)
  );`);


  await pool.query(`CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    user_id uuid UNIQUE REFERENCES users(id)
  );`);







  await pool.query(`INSERT INTO roles (id, name) VALUES (1, 'clients'), (2, 'couriers'), (3, 'admins') ON CONFLICT (id) DO NOTHING`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS "user_sessions" (
      "sid" VARCHAR PRIMARY KEY,
      "sess" JSON NOT NULL,
      "expire" TIMESTAMP(6) NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "user_sessions" ("expire");
  `);




}



runBackend();
//List of Routes

export {pool}