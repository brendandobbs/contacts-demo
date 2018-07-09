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

app.listen(APP_PORT, () => {
    console.log(`Server started on port ${APP_PORT}`);
});