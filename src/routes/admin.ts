import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";

const admin = new Hono();

admin.use(
  "*",
  basicAuth({
    username: "admin",
    password: "secret",
  })
);

admin.get("/", (c) => {
  return c.text("You are authorized!");
});

admin.get("/detail", (c) => {
  return c.text("Your password is 1234");
});

export default admin;
