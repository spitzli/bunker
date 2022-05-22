import Module from "../../classes/module.ts";
import { httpErrors, React, validator } from "../../../deps.ts";
import {
  ratelimit,
  requestValidator,
  captcha,
} from "../../middlewares/middlewares.ts";
import { generateMaylily, hashPassword, quickId } from "../../utils/mod.ts";
import { setTokens } from "../../helpers/mod.ts";
import { DEFAULT_PERMISSIONS } from "../../constants/permissions.ts";
import { Context } from "../../types/context.ts";

export default class Register extends Module {
  load() {
    this.api?.post(
      "/register",
      ratelimit(600, 10),
      requestValidator({
        username: [validator.required, validator.lengthBetween(3, 32)],
        email: [validator.required, validator.isEmail],
        password: [validator.required, validator.lengthBetween(8, 63)],
        captcha: validator.required,
      }),
      captcha(),
      async (context: Context) => {
        interface Body {
          username: string;
          email: string;
          password: string;
          captcha: string;
        }

        const body: Body = await context.request
          .body({ type: "json" })
          .value.catch(() => ({}));

        const [checkUser] = await this.db
          .select(this.db.users.username, this.db.users.email)
          .from(this.db.users)
          .where(
            this.db.users.email
              .eq(body.email)
              .or(this.db.users.username.eq(body.username))
          );

        if (checkUser) {
          if (checkUser.email === body.email) {
            throw new httpErrors.BadRequest("email already in use");
          }

          if (checkUser.username === body.username) {
            throw new httpErrors.BadRequest("username already in use");
          }
        }
        context.state.user;
        const avatarUrl = `https://cdn.statically.io/avatar/${body.username}`;
        const [user] = await this.db
          .insertInto(this.db.users)
          .values({
            id: await generateMaylily(),
            username: body.username,
            email: body.email,
            password: await hashPassword(body.password),
            avatarUrl,
            permissions: DEFAULT_PERMISSIONS,
          })
          .returning("id");
        if (!user.id) {
          throw new httpErrors.InternalServerError("Something went wrong");
        }
        await this.db.insertInto(this.db.settings).values({ id: user.id });
        await setTokens(
          {
            id: user.id,
            username: body.username,
            email: body.email,
            permissions: DEFAULT_PERMISSIONS,
            avatarUrl,
            groups: ["USER"],
            sessionId: quickId(),
          },
          context
        );
        context.response.status = 200;
        return (context.response.body = { status: "ok", message: "Success" });
      }
    );
  }
  unload() {}
}
