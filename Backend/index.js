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
  const { router: assignRoutes} = await import('./routes/assign.js');
  const { router: companyRoutes} = await import('./routes/company.js');


  app.use('/api/users', userRoutes);
  app.use('/api/shippingForm', shippingFormRoutes); 
  app.use('/api/test', testRoutes); 
  app.use('/api/location', locationRoutes); 
  app.use('/api/city', cityRoutes); 
  app.use('/api/assign', assignRoutes);
  app.use('/api/company', companyRoutes);



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
  await pool.query(`CREATE TYPE request_form_status_enum as ENUM('pending', 'declined', 'ready for pickup', 'traveling to sortation', 'waiting', 'traveling to destination', 'finished');`);
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
    vehicle_type VARCHAR(100) NOT NULL,
    max_capacity_kg INT NOT NULL,
    city_id INT references cities(id) NOT NULL
    );`)


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
    
        


    await pool.query(`
     INSERT INTO users (username, password, first_name, last_name, email, phone_number, is_validated, company_id)
    VALUES
    ( 'user1', '$argon2id$v=19$m=65536,t=3,p=4$1vGzUzqhIbqpcVoahRVTHA$vkEYiKk5POeeH/J7EMlDbYFLPg6FBQTb1YbDP2ETCgs', 'Alice', 'Smith', 'alice1@example.com', '123-456-7890', TRUE, 2),
    ( 'user2', '$argon2id$v=19$m=65536,t=3,p=4$1vGzUzqhIbqpcVoahRVTHA$vkEYiKk5POeeH/J7EMlDbYFLPg6FBQTb1YbDP2ETCgs', 'Bob', 'Johnson', 'bob2@example.com', '234-567-8901', TRUE, 2),
    ( 'user3', '$argon2id$v=19$m=65536,t=3,p=4$1vGzUzqhIbqpcVoahRVTHA$vkEYiKk5POeeH/J7EMlDbYFLPg6FBQTb1YbDP2ETCgs', 'Charlie', 'Williams', 'charlie3@example.com', '345-678-9012', TRUE, 2),
    ( 'user4', '$argon2id$v=19$m=65536,t=3,p=4$1vGzUzqhIbqpcVoahRVTHA$vkEYiKk5POeeH/J7EMlDbYFLPg6FBQTb1YbDP2ETCgs', 'Diana', 'Brown', 'diana4@example.com', '456-789-0123', TRUE, 2),
    ( 'user5', '$argon2id$v=19$m=65536,t=3,p=4$1vGzUzqhIbqpcVoahRVTHA$vkEYiKk5POeeH/J7EMlDbYFLPg6FBQTb1YbDP2ETCgs', 'Ethan', 'Jones', 'ethan5@example.com', '567-890-1234', TRUE, 2),
    ( 'user6', '$argon2id$v=19$m=65536,t=3,p=4$1vGzUzqhIbqpcVoahRVTHA$vkEYiKk5POeeH/J7EMlDbYFLPg6FBQTb1YbDP2ETCgs', 'Fiona', 'Garcia', 'fiona6@example.com', '678-901-2345', TRUE, 2),
    ( 'user7', '$argon2id$v=19$m=65536,t=3,p=4$1vGzUzqhIbqpcVoahRVTHA$vkEYiKk5POeeH/J7EMlDbYFLPg6FBQTb1YbDP2ETCgs', 'George', 'Martinez', 'george7@example.com', '789-012-3456', TRUE, 2),
    ( 'user8', '$argon2id$v=19$m=65536,t=3,p=4$1vGzUzqhIbqpcVoahRVTHA$vkEYiKk5POeeH/J7EMlDbYFLPg6FBQTb1YbDP2ETCgs', 'Hannah', 'Davis', 'hannah8@example.com', '890-123-4567', TRUE, 2),
    ( 'user9', '$argon2id$v=19$m=65536,t=3,p=4$1vGzUzqhIbqpcVoahRVTHA$vkEYiKk5POeeH/J7EMlDbYFLPg6FBQTb1YbDP2ETCgs', 'Ian', 'Rodriguez', 'ian9@example.com', '901-234-5678', TRUE, 2),
    ( 'user10', '$argon2id$v=19$m=65536,t=3,p=4$1vGzUzqhIbqpcVoahRVTHA$vkEYiKk5POeeH/J7EMlDbYFLPg6FBQTb1YbDP2ETCgs', 'Jenna', 'Hernandez', 'jenna10@example.com', '012-345-6789', TRUE, 2),
    ( 'user11', '$argon2id$v=19$m=65536,t=3,p=4$1vGzUzqhIbqpcVoahRVTHA$vkEYiKk5POeeH/J7EMlDbYFLPg6FBQTb1YbDP2ETCgs', 'Kevin', 'Lopez', 'kevin11@example.com', '111-222-3333', TRUE, 2),
    ( 'user12', '$argon2id$v=19$m=65536,t=3,p=4$1vGzUzqhIbqpcVoahRVTHA$vkEYiKk5POeeH/J7EMlDbYFLPg6FBQTb1YbDP2ETCgs', 'Laura', 'Gonzalez', 'laura12@example.com', '222-333-4444', TRUE, 2),
    ( 'user13', '$argon2id$v=19$m=65536,t=3,p=4$1vGzUzqhIbqpcVoahRVTHA$vkEYiKk5POeeH/J7EMlDbYFLPg6FBQTb1YbDP2ETCgs', 'Mike', 'Wilson', 'mike13@example.com', '333-444-5555', TRUE, 2),
    ( 'user14', '$argon2id$v=19$m=65536,t=3,p=4$1vGzUzqhIbqpcVoahRVTHA$vkEYiKk5POeeH/J7EMlDbYFLPg6FBQTb1YbDP2ETCgs', 'Nina', 'Anderson', 'nina14@example.com', '444-555-6666', TRUE, 2),
    ( 'user15', '$argon2id$v=19$m=65536,t=3,p=4$1vGzUzqhIbqpcVoahRVTHA$vkEYiKk5POeeH/J7EMlDbYFLPg6FBQTb1YbDP2ETCgs', 'Oscar', 'Thomas', 'oscar15@example.com', '555-666-7777', TRUE, 2),
    ( 'user16', '$argon2id$v=19$m=65536,t=3,p=4$1vGzUzqhIbqpcVoahRVTHA$vkEYiKk5POeeH/J7EMlDbYFLPg6FBQTb1YbDP2ETCgs', 'Paula', 'Taylor', 'paula16@example.com', '666-777-8888', TRUE, 2),
    ( 'user17', '$argon2id$v=19$m=65536,t=3,p=4$1vGzUzqhIbqpcVoahRVTHA$vkEYiKk5POeeH/J7EMlDbYFLPg6FBQTb1YbDP2ETCgs', 'Quinn', 'Moore', 'quinn17@example.com', '777-888-9999', TRUE, 2),
    ( 'user18', '$argon2id$v=19$m=65536,t=3,p=4$1vGzUzqhIbqpcVoahRVTHA$vkEYiKk5POeeH/J7EMlDbYFLPg6FBQTb1YbDP2ETCgs', 'Rachel', 'Jackson', 'rachel18@example.com', '888-999-0000', TRUE, 2),
    ( 'user19', '$argon2id$v=19$m=65536,t=3,p=4$1vGzUzqhIbqpcVoahRVTHA$vkEYiKk5POeeH/J7EMlDbYFLPg6FBQTb1YbDP2ETCgs', 'Steve', 'Martin', 'steve19@example.com', '999-000-1111', TRUE, 2)
    ON CONFLICT (username) DO NOTHING;`)


  await pool.query(`
    INSERT INTO vehicles (id, user_id, vehicle_type, max_capacity_kg, city_id)
    VALUES 
   (1, 1, 'light', 500, 1),
    (2, 2, 'medium', 500, 2),
    (3,3, 'heavy', 1000, 3),
    (4, 4, 'heavy', 1000, 4),
    (5,5, 'heavy', 1000, 5),
    (6,6, 'light', 200, 6),
    (7,7, 'light', 200, 7),
    (8,8, 'light', 200, 8),
    (9,9, 'light', 200, 9),
    (10,10 , 'light', 500, 1),
    (11, 11, 'medium', 500, 2),
    (12, 12, 'heavy', 1000, 3),
    (13, 13, 'heavy', 1000, 4),
    (14, 14, 'heavy', 1000, 5),
    (15, 15, 'light', 200, 6),
    (16, 16, 'light', 200, 7),
    (17, 17, 'light', 200, 8),
    (18, 18, 'light', 200, 9),
    (19, null, 'light', 200, 9)
    ON CONFLICT (id) DO NOTHING;`)



  await pool.query(`

    
    `)
      
  await pool.query(`CREATE TABLE IF NOT EXISTS shipping_form (
      id SERIAL PRIMARY KEY,
      client_id INT references users(id) NOT NULL,
      weight DECIMAL NOT NULL,
      status request_form_status_enum NOT NULL,
      inventory JSONB NOT NULL,
      shipping_to INT references locations(id) NOT NULL,
      shipping_from INT references locations(id) NOT NULL,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE,
      vehicle_to_id INT references vehicles(id), 
      vehicle_from_id INT references vehicles(id),
      finished_date DATE
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