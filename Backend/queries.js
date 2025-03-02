const queries = {
    users: {
        getUsersQ: `
            SELECT u.*
            FROM users u;
        `,
        getUserByIdQ: `
            SELECT u.*
            FROM users u
            WHERE u.id = $1;   
        `,
        registerQ: `
            INSERT INTO users (username, password, first_name, last_name, email, phone_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
        `,
        loginQ: `
            SELECT u.*
            FROM users u
            WHERE u.username = $1 AND u.password = $2;
        `,
        getUserByUsernameQ:`
            SELECT u.*
            FROM users u
            WHERE u.username = $1;
        `
    }
}


export {queries}