const queries = {
    users: {
        getUsersQ: `
            SELECT u.*
            FROM users u;
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
        `
    },
    company: {
        createCompany: `
            INSERT INTO companies (name) VALUES ($1) RETURNING *;
        `
        
    },
    location: {
        createLocation: `
            INSERT INTO locations (company_id, name, address, status) VALUES ($1, $2, $3, $4) RETURNING *;
        `,
        getLocationsQ:`
            SELECT l.*
            FROM locations l;
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
            SELECT s.*
            FROM shipping s
        `,
        addShippingFormQ:`
            INSERT INTO shipping_form (client_id, weight, status, inventory, shipping_from, shipping_to) 
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `,

    }

}


export {queries}