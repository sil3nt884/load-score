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
        const id = request.params.id
        console.log(id)

        const schema = 'public'

        const query = `
           SELECT score from ${schema}.users WHERE id = $1
        `

        const res = await client.query(query, [id])
        await client.end();
        return response.status(200).send(String(res.rows[0].score))
    }
    catch (err) {
        console.log(err)
    }


    console.log('save');
}