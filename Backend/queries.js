const queries = {
    users: {
        getUsersQ: `
            SELECT u.*
            FROM users u;
        `,
        getPublicInformationOfUserQ:`
            SELECT u.first_name, u.last_name, c.name as company_name, u.email, u.phone_number, c.id
            FROM users u LEFT JOIN companies c
                        ON u.company_id = c.id
            WHERE u.id = $1;
        `,
        getUserByIdQ: `
            SELECT u.*, c.name AS company_name
            FROM users u LEFT JOIN companies c
                        ON u.company_id = c.id 
            WHERE u.id = $1;
        `,
        registerQ: `
            INSERT INTO users (username, password, first_name, last_name, email, phone_number, is_validated, company_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8 ) RETURNING *;
        `,
        loginQ: `
            SELECT u.*
            FROM users u
            WHERE u.username = $1 AND u.password = $2 AND u.is_validated = true;
        `,
        getUserByUsernameQ:`
            SELECT u.*, c.name AS company_name
            FROM users u LEFT JOIN companies c
                         ON u.company_id = c.id
            WHERE u.username = $1;
        `,
        getUnverifiedUsersQ:`
            SELECT u.*
            FROM users u
            WHERE is_validated = false
        `,
        updateVerificationUserQ:`
            UPDATE users
            SET is_validated = $1
            WHERE id = $2
            RETURNING *;
        `,
        updateEmailAndPhoneNumberQ:`
            UPDATE users
            SET email = $1, 
                phone_number = $2
            WHERE id = $3
            RETURNING *;
        `
    },
    company: {
        createCompany: `
            INSERT INTO companies (name) VALUES ($1) RETURNING *;
        `
        
    },
    location: {
        createLocation: `
            INSERT INTO locations (company_id, name, address, city_id) VALUES ($1, $2, $3, $4) RETURNING *;
        `,
        getLocationsQ:`
            SELECT l.*
            FROM locations l;
        `,
        getLocationsByCompanyIdQ:`
            SELECT l.*, c.name AS city_name
            FROM locations l LEFT JOIN cities c
                        ON l.city_id = c.id
            WHERE l.company_id = $1;
        `
    },
    vehicle: {
        getUnassignedVehicleQ:`
            SELECT v.*
            FROM vehicles v
            WHERE v.user_id IS NULL
            LIMIT 1;
        `,
        updateVehicleQ:`
            UPDATE vehicles
            SET user_id = $1 
            WHERE id = $2;
        `
    },
    shippingForm: {
        getShippingFormQ:`
            SELECT s.*, TO_CHAR(s.created_at, 'Mon DD, YYYY') as formattedDate
            FROM shipping_form s
        `,
        getShippingFormQByCompanyIdQ:`
            SELECT s.*, TO_CHAR(s.created_at, 'Mon DD, YYYY') as formattedDate
            FROM shipping_form s
            WHERE s.company_id = $1;
        `,
        addShippingFormQ:`
            INSERT INTO shipping_form (client_id, weight, status, inventory, shipping_from, shipping_to) 
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `,
        getShippingFormByVehicleId:`
            SELECT s.*, TO_CHAR(s.created_at, 'Mon DD, YYYY') as formattedDate
            FROM shipping_form s
            WHERE s.vehicle_id = $1;        
        `

    },
    city: {
        getCitiesQ:`
            SELECT c.*
            FROM cities c;
        `
    }

}


export {queries}