const Express = require ("express");
const GraphHttp = require ("express-graphql");
const Schema = require("./schema.js");

const APP_PORT = process.env.APP_PORT;

const app = Express();

app.use('/graphql', GraphHttp({
    schema: Schema,
    pretty: true,
    graphiql: true
}));

app.post('/events', function(req, res) {
    console.log('Event received');
    const event = parseEvent(req, res);
    }
);

app.listen(APP_PORT, () => {
    console.log(`Server started on port ${APP_PORT}`);
});

function parseEvent(req, res)
{
    let data = req.body;
    if (req.body.length > 0) {
        if (req.get('content-type') === 'application/json') {
            data = JSON.parse(req.body.toString('utf-8'))
        } else {
            data = req.body.toString('utf-8')
        }
    }
    console.log('Event data = ' + data);
    const event = {
            'event-type': req.get('event-type'),
            'event-id': req.get('event-id'),
            'event-time': req.get('event-time'),
            'event-namespace': req.get('event-namespace'),
            data,
            'extensions': { request: req, response: res },
    };
    return event;
}