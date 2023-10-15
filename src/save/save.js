const pg = require('pg');

const { Client } = pg;
const PORT = 5432
const crypto = require('crypto');


const connectToDatabase = async () => {
    //new client instance from pool connection localhost:5432
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: 'postgres',
        port: PORT,
    });

    await client.connect();

    return client;
}



module.exports =  async (request, response) => {
    try {
        const client = await connectToDatabase()
        const body = request.body
        console.log(body)

        const {
            id,
            score
        } = body

        const schema = 'public'

        const query = `
            WITH 
            user_check AS (
                SELECT id
                FROM ${schema}.users
                WHERE id = $1
            ),
            update_score AS (
            UPDATE ${schema}.users
            SET score = $2
            WHERE id = $1
              AND (SELECT 1 FROM user_check) IS NOT NULL
            RETURNING *
           ),
           insert_score AS (
            INSERT
            INTO ${schema}.users(id, score)
            SELECT $1, $2
            WHERE NOT EXISTS (SELECT 1 FROM user_check)
            RETURNING *
          )
            SELECT *
            FROM update_score
            UNION ALL
            SELECT *
            FROM insert_score;
        `

        const res = await client.query(query, [id, score])
        await client.end();
        return response.status(200).send(res.rows)

    }
    catch (err) {
        console.log(err)
    }


    console.log('save');
}