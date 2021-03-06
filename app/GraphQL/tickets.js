import { gql } from 'apollo-server-express'
import * as db from '../database'

export const typeDefs = gql`
    extend type Query {
        tickets: [Ticket]
        ticket(id: ID!): Ticket
        ticketByPk(id: ID!, subject: String): Ticket
    }


    type Mutation {
        ticket(subject: String!, priority_id: Int!, status_id: Int!, user_id: Int!, assigned_to_user_id: Int! ): Ticket!
        deleteTicket(id: ID!): Ticket
    }

    type Ticket {
        id: ID!
        subject: String
        test: Int
        priority_id: Int
        priority: Priority
        status_id: Int
        status: Status
        user_id: Int
        user: User
        assigned_to_user_id: Int
        assigned_to_user: User
    }
`

export const resolvers = {
    Query: {
        tickets: async () => db.tickets.findAll(),
        ticket: async (obj, args, context, info) =>
            db.tickets.findByPk(args.id),

        ticketByPk: async (obj, args, context, info) => {
            console.log('======== query variables print start =====');
            console.log( args );
            console.log('========== query variables print end ==========');
            return db.tickets.findByPk(args.id)
        }
    },
    
    Ticket: {
        user: async (obj, args, context, info) =>
            db.users.findByPk(obj.user_id),
        priority: async (obj, args, context, info) =>
            db.priorities.findByPk(obj.priority_id),
        status: async (obj, args, context, info) =>
            db.status.findByPk(obj.status_id),
        assigned_to_user: async (obj, args, context, info) =>
            db.users.findByPk(obj.assigned_to_user_id),
        test: () => 2
    },

    Mutation: {
        ticket: async (parent, args) => {
            console.log('======== mutation variables print start =====');
            console.log( args );
            console.log('========== mutation variables print end ==========');
            const insertRow = await db.tickets.create(args);
            return insertRow;
        },
        deleteTicket: async (parent, args) => {
            const deleteRow = await db.tickets.destroy({
                where: args
            })
            return args;
        }
    }

}
