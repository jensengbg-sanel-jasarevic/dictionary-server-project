const bcrypt = require("bcryptjs");
const queries = require("./model/queries.js");
require("dotenv").config();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const Extracter = require("passport-jwt").ExtractJwt;

const cookieExtractor = (req) => {
  let token = null;
  console.log("req.cookies: " + req.headers("authorization"));
  console.log("access_token: " + req.cookies["access_token"]);
  token = req.header("authorization");
  return token;
};

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    authenticate
  )
);

passport.use(
  "user-local",
  new JwtStrategy(
    {
      jwtFromRequest: Extracter.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SESSION_SECRET,
    },
    authorization
  )
);

function authenticate(req, email, password, done) {
  let userEmail = req.body.email;
  let userPwd = req.body.password;
  queries.readUser(userEmail).then((user) => {
    if (
      !user[0] ||
      user[0].password == "undefined" ||
      user[0].password == null ||
      !bcrypt.compareSync(userPwd, user[0].password)
    ) {
      return done(null, false, {
        message: "invalid user and password combination",
      });
    }
    done(null, user[0]);
  });
}

//authorization to protect account endpoints
function authorization(id, done) {
  queries.readUser(id.sub).then((user) => {
    if (!user[0]) {
      return done(null, false, {
        message: "Invalid user",
      });
    }
    return done(null, user[0]);
  });
}

passport.serializeUser(function (user, done) {
  return done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  queries.readUserById(id).then((user) => {
    if (!user[0]) {
      return done(null, false, {
        message: "invalid user and password combination",
      });
    }
    return done(null, user[0]);
  });
});
