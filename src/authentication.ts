import * as passport from "passport"
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt"
import { User } from "./entity/User"

const extractJWT = ExtractJwt.fromAuthHeaderAsBearerToken()

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: extractJWT,
      secretOrKey: process.env.JWT_SECRET || "CHANGE_ME!!!"
    },
    async (payload, done) => {
      if (payload && payload.id) {
        const user = await User.findOneById(payload.id)
        if (user) {
          return done(null, user)
        }
      }

      return done(null, {})
    }
  )
)

passport.serializeUser(async ({ id }, done) => {
  try {
    const { password, ...user } = await User.findOneById(id)
    return done(null, user)
  } catch (err) {
    return done(err)
  }
})

export const authentication = app => {
  const authenticate = passport.authenticate("jwt")

  app.use(passport.initialize())

  app.use((req, res, next) => {
    extractJWT(req) ? authenticate(req, res, next) : next()
  })
}

export const ensureAuth = user => () => {
  if (!user) {
    throw new Error("Unauthorized")
  }
}

export const withAuth = func => {
  return (obj, args, context, info) => {
    context.ensureAuth()
    return func(obj, args, context, info)
  }
}
