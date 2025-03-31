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
        getPublicInformationOfClientUserQ:`
            SELECT u.first_name, u.last_name, c.name as company_name, u.email, u.phone_number, c.id
            FROM users u LEFT JOIN companies c
                        ON u.company_id = c.id
            WHERE u.id = $1;
        `,
        getPublicInformationOfAdminUserQ:`
            SELECT u.first_name, u.last_name, c.name as company_name, u.email, u.phone_number, c.id
            FROM users u LEFT JOIN companies c
                        ON u.company_id = c.id
            WHERE u.id = $1;
        `,
        getPublicInformationOfCourierUserQ:`
            SELECT u.first_name, u.last_name, c.name as company_name, u.email, u.phone_number, c.id AS company_id,
            v.id AS vehicle_id, v.vehicle_type, v.max_capacity_kg, v.city_id AS vehicle_city_id, ci.name AS vehicle_city_name
            FROM users u LEFT JOIN companies c
                        ON u.company_id = c.id
                        LEFT JOIN vehicles v
                        ON u.id = v.user_id
                        LEFT JOIN cities ci
                        ON v.city_id = ci.id
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
            SELECT u.*, c.name as company_name, c.id as company_id
            FROM users u
                LEFT JOIN companies c
                ON u.company_id = c.id
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
        `,
        getVehicleByUserIdQ:`
            SELECT v.*
            FROM vehicles v
            WHERE v.user_id = $1 
            LIMIT 1;
        `,
        getAvailableVehicleForSRFQByCapacityAndCity: `
            SELECT v.id, v.max_capacity_kg, COALESCE(SUM(s.weight), 0) AS current_capacity,
            (v.max_capacity_kg - COALESCE(SUM(s.weight), 0)) as available_space
            FROM vehicles v LEFT JOIN shipping_form s
                        ON v.id = s.vehicle_id
            WHERE v.city_id = $1
            GROUP BY v.id, v.max_capacity_kg
            HAVING (v.max_capacity_kg - COALESCE(SUM(s.weight), 0)) > $2
            LIMIT 1;
        `
    },
    shippingForm: {
        getShippingFormQ:`
            SELECT s.*, TO_CHAR(s.created_at, 'Mon DD, YYYY') as formattedDate
            FROM shipping_form s
        `,
        getShippingFormQByUserIdQ:`
            SELECT s.*, TO_CHAR(s.created_at, 'Mon DD, YYYY') as formattedDate,
            c_from.name AS from_city_name,
            c_from.id AS from_city_id,
            c_to.name AS to_city_name,
            c_to.id AS to_city_id,
            l_from.name AS from_location_name,
            l_from.address AS from_location_address,
            l_to.name AS to_location_name,
            l_to.address AS to_location_address
            FROM shipping_form s JOIN locations l_from
            on s.shipping_from = l_from.id
            JOIN cities c_from on l_from.city_id = c_from.id
            JOIN locations l_to ON s.shipping_to = l_to.id
            JOIN cities c_to ON l_to.city_id = c_to.id
            WHERE s.client_id = $1;
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
        `,
        updateShippingFormStatusById: `
            UPDATE shipping_form
            SET status = $1
            WHERE id = $2
            RETURNING *;
        `,
        getShippingFormQIncludingLocationAndCityOfToAndFrom: `
            SELECT s.id,
            c_from.name AS from_city_name,
            c_from.id AS from_city_id,
            c_to.name AS to_city_name,
            c_to.id AS to_city_id
            FROM shipping_form s JOIN locations l_from
            on s.shipping_from = l_from.id
            JOIN cities c_from on l_from.city_id = c_from.id
            JOIN locations l_to ON s.shipping_to = l_to.id
            JOIN cities c_to ON l_to.city_id = c_to.id;
        `,
        updateShippingFormToAVehicleId: `
            UPDATE shipping_form
            SET vehicle_from_id = $1
            WHERE id = $2
            RETURNING *;
        `,
        updateShippingFormToAVehicleToId: `
        UPDATE shipping_form
        SET vehicle_to_id = $1
        WHERE id = $2
        RETURNING *;
        `,
        getPendingShippingForm: `
        SELECT s.*, TO_CHAR(s.created_at, 'Mon DD, YYYY') AS formatted_date, u.first_name AS first_name, u.last_name AS last_name, c.name AS company_name, l.name AS l_origin, lo.name AS lo_dest
        FROM shipping_form s 
        JOIN users u ON s.client_id = u.id
        JOIN companies c ON u.company_id = c.id
        JOIN locations l ON s.shipping_from = l.id
        JOIN locations lo ON s.shipping_to = lo.id
        WHERE s.status=$1
        ORDER BY s.created_at ASC;`,

    },



    city: {
        getCitiesQ:`
            SELECT c.*
            FROM cities c;
        `
    },


}


export {queries}