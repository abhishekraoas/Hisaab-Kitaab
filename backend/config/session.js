import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
dotenv.config();

export const sessionConfig = session({
  secret: process.env.SESSION_SECRET || "hisaab-kitaab-secret-key-2026",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.URL_DB,
    collectionName: "sessions",
    ttl: 24 * 60 * 60, // 1 day
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS in production
    sameSite: "lax",
  },
});
