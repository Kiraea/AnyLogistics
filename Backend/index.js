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

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// if u are sending data from client to server with them having different ports wont work cause of seucrity so we have to explicitly allow this
app.use(cors({ 
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}))

app.use(express.json()); // 
app.use(urlencoded({extended:true}));

app.get('/', function (req, res) {
  res.send('Hello World')
})

const runBackend = async () => {
  // TEMPORARY POOL/CLIENT TO MAKE AnyLogistics Schema
  console.log(process.env.DB_DATABASE);
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
  const { router: shippingFormRoutes } = await import('./routes/SRF.js');
  const { router: locationRoutes } = await import('./routes/location.js');
  const { router: cityRoutes} = await import('./routes/city.js');
  app.use('/api/users', userRoutes);
  app.use('/api/shippingForm', shippingFormRoutes); 
  app.use('/api/test', testRoutes); 
  app.use('/api/location', locationRoutes); 
  app.use('/api/city', cityRoutes); 



  // 4. CREATION ETC DATABASE TABLES
  await setupDatabase(pool);





  app.listen(process.env.PORT, () => {
    console.log(process.env.PORT);
  });


}

// ALL BACKEND CREATE COMMANDS
//dasdasdsa
const setupDatabase = async (pool) => {

  /*

  await pool.query(`DROP TABLE IF EXISTS shipping_form CASCADE`);
  await pool.query(`DROP TABLE IF EXISTS locations CASCADE;`);
  await pool.query(`DROP TABLE IF EXISTS users CASCADE;`);
  await pool.query(`DROP TABLE IF EXISTS companies CASCADE;`);
  await pool.query(`DROP TABLE IF EXISTS vehicles CASCADE;`);
  await pool.query(`DROP TABLE IF EXISTS cities CASCADE;`);

  

  await pool.query(`DROP TYPE IF EXISTS request_form_status_enum CASCADE`); 
  await pool.query(`DROP TYPE IF EXISTS request_form_status_approval_enum CASCADE`); 
  await pool.query(`DROP TYPE IF EXISTS location_status_enum CASCADE`); 
  await pool.query(`DROP TYPE IF EXISTS vehicle_type_enum CASCADE`); 
  await pool.query(`DROP TYPE IF EXISTS vehicle_status_enum CASCADE`); 

    


  await pool.query(`CREATE TYPE location_status_enum as ENUM('open', 'close');`);
  await pool.query(`CREATE TYPE vehicle_type_enum as ENUM('light', 'medium', 'heavy');`);
  await pool.query(`CREATE TYPE vehicle_status_enum as ENUM('free', 'busy');`);


  await pool.query(`CREATE TYPE request_form_status_enum as ENUM('pending', 'declined', 'ready for pickup', 'in travel', 'waiting', 'cancelled', 'finished');`);
  
  */


  // 1 same company but admin(logistic), 2 same compny(logistic) but rider, and 3-9999 is basically other companies 
  await pool.query(`CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
  );`);



  await pool.query(`INSERT INTO companies (id, name) VALUES (1, 'AnyLogisticsA'), (2, 'AnyLogisticsB') ON CONFLICT (id) DO NOTHING;`);
  
  await pool.query(`SELECT setval(pg_get_serial_sequence('companies', 'id'), COALESCE((SELECT MAX(id) FROM companies), 1), TRUE);`);

  await pool.query(`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY, 
    username VARCHAR(255) UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    is_validated BOOLEAN NOT NULL DEFAULT FALSE,
    company_id INT references companies(id)
  );`)

  await pool.query(`CREATE TABLE IF NOT EXISTS cities(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
    );`)


  await pool.query(`CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    company_id INT references companies(id),
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city_id INT references cities(id)
  );`)

  await pool.query(`CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    user_id INT references users(id) DEFAULT NULL,
    vehicle_type vehicle_type_enum NOT NULL,
    status vehicle_status_enum NOT NULL
    );`)



  
    
  await pool.query(`
    INSERT INTO vehicles (user_id, vehicle_type, status)
    VALUES 
      (NULL, 'light', 'free'),
      (NULL, 'medium', 'busy'),
      (NULL, 'heavy', 'free'),
      (NULL, 'light', 'busy'),
      (NULL, 'medium', 'free'),
      (NULL, 'heavy', 'busy'),
      (NULL, 'light', 'free'),
      (NULL, 'medium', 'busy'),
      (NULL, 'heavy', 'free'),
      (NULL, 'light', 'busy');`);
      

      
      
  await pool.query(`
    INSERT INTO cities (name)
    VALUES 
      ('Manila'),
      ('Quezon'),
      ('Makati'),
      ('Pasig'),
      ('Taguig'),
      ('Mandaluyong'),
      ('Pasay'),
      ('Caloocan'),
      ('Muntinlupa')
    ON CONFLICT (name) DO NOTHING;`);
    

  await pool.query(`CREATE TABLE IF NOT EXISTS shipping_form (
      id SERIAL PRIMARY KEY,
      client_id INT references users(id) NOT NULL,
      weight DECIMAL NOT NULL,
      status request_form_status_enum NOT NULL,
      inventory JSONB NOT NULL,
      shipping_to VARCHAR(255) NOT NULL,
      shipping_from INT references locations(id) NOT NULL,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE,
      vehicle_id INT references vehicles(id) 
    );`);



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