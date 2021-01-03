const {Pool} = require('pg');

function response(data, status) {
    console.log("Sending response: ", data, status || 200)
    return {
        statusCode: status || 200,
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    }
}

const pool = new Pool({connectionString: process.env.PG_URI, ssl: { rejectUnauthorized: false }});

exports.handler = async function(event, context) {
    const match = event.path.match(/^\/notes\/?([^\/]+)?/)
    if (!match) {
        return  {
            statusCode: 404,
            body: "Not Found"
        }
    }

    try {
        const noteId = match[1];
        const now = new Date();
        const data = event.body && JSON.parse(event.body)
        switch (event.httpMethod) {
            case 'GET':
                if (noteId) {
                    const {rows} = await pool.query('select * from notes where id = $1', [noteId,]);
                    return response(JSON.stringify(rows[0]))
                }

                const {rows} = await pool.query('select * from notes order by id desc');
                return response(rows)
            case 'POST':
                if (noteId) {
                    return response({error: "Method not allowed"}, 405)
                }
                const result = await pool.query(
                    'insert into notes (title, body, created_at, updated_at) values ($1, $2, $3, $3) returning id',
                    [data.title, data.body, now]
                ); 
                const insertedId = result.rows[0].id;
                return response(data)
            case 'PUT':
                if (!noteId) {
                    return response({error: "Method not allowed"}, 405)
                }
                const updatedId = Number(noteId);
                await pool.query(
                    'update notes set title = $1, body = $2, updated_at = $3 where id = $4',
                    [data.title, data.body, now, updatedId]
                );
                return response(data)
            case 'DELETE':
                await pool.query('delete from notes where id = $1', [noteId]);
                return response({}, 200)
        }
    } catch(err) {
        console.log(err);
        return response(JSON.stringify(err.toString()), 500);
    }
}