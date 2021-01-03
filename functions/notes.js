import {Pool} from 'pg';
import marked from 'marked';
import sanitizeHtml from 'sanitize-html';

const allowedTags = sanitizeHtml.defaults.allowedTags.concat([
    'img',
    'h1',
    'h2',
    'h3',
  ]);
  const allowedAttributes = Object.assign(
    {},
    sanitizeHtml.defaults.allowedAttributes,
    {
      img: ['alt', 'src'],
    }
  );
  
function response(data, status) {
    return {
        statusCode: status || 200,
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    }
}

function formatNote(note) {
    return {...note, body_html: note.body && sanitizeHtml(marked(note.body), { allowedTags, allowedAttributes })}
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
                    return response(JSON.stringify(formatNote(rows[0])))
                }

                const {rows} = await pool.query('select * from notes order by id desc');
                return response(rows.map(formatNote))
            case 'POST':
                if (noteId) {
                    return response({error: "Method not allowed"}, 405)
                }
                const createResult = await pool.query(
                    'insert into notes (title, body, created_at, updated_at) values ($1, $2, $3, $3) returning id',
                    [data.title, data.body, now]
                ); 
                return response(formatNote(createResult))
            case 'PUT':
                if (!noteId) {
                    return response({error: "Method not allowed"}, 405)
                }
                const updatedId = Number(noteId);
                const updateResult = await pool.query(
                    'update notes set title = $1, body = $2, updated_at = $3 where id = $4',
                    [data.title, data.body, now, updatedId]
                );
                return response(formatNote(updateResult))
            case 'DELETE':
                await pool.query('delete from notes where id = $1', [noteId]);
                return response({}, 200)
        }
    } catch(err) {
        console.log(err);
        return response(JSON.stringify(err.toString()), 500);
    }
}