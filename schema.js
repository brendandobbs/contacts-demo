const {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLString,
    GraphQLList,
    GraphQLSchema
  } = require("graphql");
const { attributeFields } = require('graphql-sequelize');
//const db = require("./db.js");
//const { Contact } = require("./db.js");

const Sequelize = require("sequelize");
const _ = require("lodash");
const Faker = require("faker"); 

//
// Sequelize ORM configuration
// 

// Create connection
// 'contacts-demo','root','',{ dialect : "mysql", host : "localhost", port : "3306" }
const Conn = new Sequelize
(
    //'contacts-demo','root','',{ dialect : "mysql", host : "localhost", port : "3306" }
    process.env.DB_SCHEMA,process.env.DB_USER,process.env.DB_PASSWORD,{ dialect : process.env.DB_DIALECT, host : process.env.DB_HOST, port : process.env.DB_PORT }
);

const Contact = Conn.define('contact', {
    firstName : {
        type: Sequelize.STRING, 
        allowNull: false
    },
    lastName : {
        type: Sequelize.STRING, 
        allowNull: false
    },
    email : {
        type: Sequelize.STRING, 
        allowNull: false,
        unique: true
        // validate: {
        //     isEmail: true
        // }
    }
});

// create demo data
Conn.sync({force: true}).then(() => {
 _.times(10, () => {
     return Contact.create({
         firstName: Faker.name.firstName(),
         lastName : Faker.name.lastName(),
         email: Faker.internet.email()
     });
 });
});

//
// GraphQL Configuration
//
const GContact = new GraphQLObjectType({
    name: 'Contact',
    description: 'Represents a contact',
    fields: attributeFields(Contact)
});

const Query = new GraphQLObjectType({
    name: 'Query',
    description: 'Root query',
    fields : () => {
        return {
            contacts : {
                type : new GraphQLList(GContact),
                args : {
                    firstName : {
                        type: GraphQLString
                    },
                    lastName: {
                        type: GraphQLString
                    },
                    email : {
                        type: GraphQLString
                    }
                },
                resolve (root, args) {
                    return Contact.findAll({where: args});
                }
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name : 'Mutation',
    description : 'Functions for creating/updating contact',
    fields() {
        return {
            updateContact: {
                type: GContact,
                args: {
                    firstName:{
                        type : new GraphQLNonNull(GraphQLString)
                    },
                    lastName:{
                        type : new GraphQLNonNull(GraphQLString)
                    },
                    email:{
                        type : new GraphQLNonNull(GraphQLString)
                    }
                    },
                resolve(root, args) {
                    
                        return Contact.findOne({ where: {email: args.email}})
                            .then(contact => {
                                
                                if(contact) { // update
                                    console.log("Found contact: " + args.email);
                                    return contact.update(args);
                                }
                                else { // insert
                                    console.log("Creating contact: " + args.email);
                                    return Contact.create(args);
                                }
                            });
                        }
                    
                        // return Contact.upsert({
                        //     firstName: args.firstName,
                        //     lastName: args.lastName,
                        //     email: args.email.toLowerCase()
                        // })
                    
                
            }
        }
    }
});

const Schema = new GraphQLSchema({query: Query, mutation: Mutation});

module.exports = Schema;