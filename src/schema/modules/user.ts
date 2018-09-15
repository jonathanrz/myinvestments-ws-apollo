import * as jwt from "jwt-simple"
import { User } from "../../entity/User"

const JWT_SECRET = process.env.JWT_SECRET || "CHANGE_ME!!!"
// const canCreateUser = process.env.NODE_ENV === "test"
const canCreateUser = true

export const typeDefs = `
  type User {
    id: Int
    email: String!
  }

  input UserInput {
    email: String!
    password: String!
  }
`

export const query = `
  me: User
  user(id: Int!): User
  users: [User]
`

export const mutation = `
  ${canCreateUser ? "createUser(data: UserInput!): User" : ""}
  ${
    canCreateUser ? "updateUserPassword(id: Int!, password: String!): User" : ""
  }
  login(email: String!, password: String!): String
`

const mutations: any = {
  login: async (_, { email, password }) => {
    const user = await User.findOne({ email })

    if (user && (await user.validatePassword(password))) {
      return jwt.encode({ id: user.id }, JWT_SECRET)
    }

    throw new Error("Unauthorized")
  }
}

if (canCreateUser) {
  mutations.createUser = (_, { data }) => User.create({ ...data }).save()
  mutations.updateUserPassword = async (_, { id, password }) => {
    const user = await User.findOne({ id })
    user.password = password
    user.save()
    return user
  }
}

export const resolvers = {
  Query: {
    user: (_, { id }) => User.findOneById(id),
    users: () => User.find(),
    me: (_, __, { user }) => user
  },
  Mutation: mutations
}
