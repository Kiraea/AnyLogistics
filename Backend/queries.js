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
        `,
        getCompany:`
            SELECT c.*
            FROM companies c
        `,
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
        findFreeVehicleQ:`
        SELECT v.*
        FROM vehicles v
        WHERE v.user_id IS NULL
        LIMIT 1;
        `,
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
            SELECT 
                v.id, 
                v.max_capacity_kg, 
                COALESCE(SUM(
                    CASE 
                        -- Include weight for vehicle_from_id only if status is active
                        WHEN v.id = s.vehicle_from_id 
                            AND s.status NOT IN ('waiting', 'traveling to sortation', 'finished') 
                            THEN s.weight
                        -- Include weight for vehicle_to_id only if status is active
                        WHEN v.id = s.vehicle_to_id 
                            AND s.status NOT IN ('finished', 'ready for pickup', 'traveling to sortation', 'pending', 'declined') 
                            THEN s.weight
                        ELSE 0 
                    END
                ), 0) AS current_capacity,
                (v.max_capacity_kg - COALESCE(SUM(
                    CASE 
                        WHEN v.id = s.vehicle_from_id AND s.status NOT IN ('waiting', 'traveling to sortation', 'finished') THEN s.weight
                        WHEN v.id = s.vehicle_to_id AND s.status NOT IN ('finished', 'ready for pickup', 'traveling to sortation', 'pending', 'declined') THEN s.weight
                        ELSE 0 
                    END
                ), 0)) AS available_space
            FROM "AnyLogistics".vehicles v 
            LEFT JOIN "AnyLogistics".shipping_form s
                ON (v.id = s.vehicle_from_id OR v.id = s.vehicle_to_id) -- Fix: No status filter in ON clause
            WHERE v.city_id = $1
            GROUP BY v.id, v.max_capacity_kg
            HAVING (v.max_capacity_kg - COALESCE(SUM(
                CASE 
                    WHEN v.id = s.vehicle_from_id AND s.status NOT IN ('waiting', 'traveling to sortation', 'finished') THEN s.weight
                    WHEN v.id = s.vehicle_to_id AND s.status NOT IN ('finished', 'ready for pickup', 'traveling to sortation', 'pending', 'declined') THEN s.weight
                    ELSE 0 
                END
            ), 0)) >= $2
            LIMIT 1; -- Adjust threshold as needed
        `,
        getAvailableVehicleForSRFQByCapacityAndCityTo: `
            SELECT 
                v.id, 
                v.max_capacity_kg, 
                COALESCE(SUM(
                    CASE 
                        -- Include weight for vehicle_from_id only if status is active
                        WHEN v.id = s.vehicle_from_id 
                            AND s.status NOT IN ('waiting', 'traveling to sortation', 'finished') 
                            THEN s.weight
                        -- Include weight for vehicle_to_id only if status is active
                        WHEN v.id = s.vehicle_to_id 
                            AND s.status NOT IN ('finished', 'ready for pickup', 'traveling to sortation', 'pending', 'declined') 
                            THEN s.weight
                        ELSE 0 
                    END
                ), 0) AS current_capacity,
                (v.max_capacity_kg - COALESCE(SUM(
                    CASE 
                        WHEN v.id = s.vehicle_from_id AND s.status NOT IN ('waiting', 'traveling to sortation', 'finished') THEN s.weight
                        WHEN v.id = s.vehicle_to_id AND s.status NOT IN ('finished', 'ready for pickup', 'traveling to sortation', 'pending', 'declined') THEN s.weight
                        ELSE 0 
                    END
                ), 0)) AS available_space
            FROM "AnyLogistics".vehicles v 
            LEFT JOIN "AnyLogistics".shipping_form s
                ON (v.id = s.vehicle_from_id OR v.id = s.vehicle_to_id) -- Fix: No status filter in ON clause
            WHERE v.city_id = $1
            GROUP BY v.id, v.max_capacity_kg
            HAVING (v.max_capacity_kg - COALESCE(SUM(
                CASE 
                    WHEN v.id = s.vehicle_from_id AND s.status NOT IN ('waiting', 'traveling to sortation', 'finished') THEN s.weight
                    WHEN v.id = s.vehicle_to_id AND s.status NOT IN ('finished', 'ready for pickup', 'traveling to sortation', 'pending', 'declined') THEN s.weight
                    ELSE 0 
                END
            ), 0)) >= $2
            LIMIT 1; -- Adjust threshold as needed
        `
    },
    shippingForm: {
        getShippingFormQ:`
            SELECT s.*, 
                TO_CHAR(s.created_at, 'Mon DD, YYYY') AS formatted_date,
                COALESCE(TO_CHAR(s.finished_date, 'Mon DD, YYYY'), 'Not yet finished') AS formatted_finished_date,
                c_from.name AS city_from_name,
                c_to.name AS city_to_name,
                l_from.address AS location_from_address,
                l_to.address AS location_to_address,
                u_from.last_name AS user_from_courier,
                u_to.last_name AS user_to_courier,
                u_client.last_name AS client
            FROM shipping_form s
            LEFT JOIN vehicles v_from ON s.vehicle_from_id = v_from.id
            LEFT JOIN vehicles v_to ON s.vehicle_to_id = v_to.id
            LEFT JOIN users u_from ON v_from.user_id = u_from.id   
            LEFT JOIN users u_to ON v_to.user_id = u_to.id         
            LEFT JOIN locations l_from ON s.shipping_from = l_from.id
            LEFT JOIN locations l_to ON s.shipping_to = l_to.id
            LEFT JOIN cities c_from ON l_from.city_id = c_from.id
            LEFT JOIN cities c_to ON l_to.city_id = c_to.id
            LEFT JOIN users u_client ON s.client_id = u_client.id;
        `,
        getShippingFormQByUserIdQ:`
            SELECT s.*, TO_CHAR(s.created_at, 'Mon DD, YYYY') as formattedDate,
            COALESCE(TO_CHAR(s.finished_date, 'Mon DD, YYYY'), 'Not yet finished') AS formatted_finished_date,
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
            SELECT s.*, TO_CHAR(s.created_at, 'Mon DD, YYYY') as formatted_date
            FROM shipping_form s
            WHERE s.vehicle_id = $1;        
        `,
        getShippingFormByVehicleIdFrom:`
            SELECT s.*, TO_CHAR(s.created_at, 'Mon DD, YYYY') as formatted_date
            FROM shipping_form s
            WHERE s.vehicle_from_id = $1
            AND s.status IN ('pending', 'declined', 'ready for pickup', 'traveling to sortation');   
        `,
        getShippingFormByVehicleIdFinished:`
            SELECT s.*, TO_CHAR(s.created_at, 'Mon DD, YYYY') as formatted_date,
            COALESCE(TO_CHAR(s.finished_date, 'Mon DD, YYYY'), 'Not yet finished') AS formatted_finished_date
            FROM shipping_form s
            WHERE s.status = 'finished'
            AND (s.vehicle_from_id = $1 OR s.vehicle_to_id = $2);
        `,

        getShippingFormByVehicleIdTo:`
            SELECT s.*, TO_CHAR(s.created_at, 'Mon DD, YYYY') as formattedDate
            FROM shipping_form s
            WHERE s.vehicle_to_id = $1
            AND s.status IN ('traveling to destination','waiting');   
            ;        
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
        getShippingFormById: `
        SELECT s.*
        FROM shipping_form s
        WHERE s.id=$1;`,

        updateFinishedDate:`
            UPDATE shipping_form
            SET finished_date = $1
            WHERE id = $2;
        `

    },



    city: {
        getCitiesQ:`
            SELECT c.*
            FROM cities c;
        `
    },


}


export {queries}