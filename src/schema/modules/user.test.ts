import { encode as encodeJWT } from "jwt-simple";

const JWT_SECRET = process.env.JWT_SECRET || "CHANGE_ME!!!";

const jwt = id => encodeJWT({ id }, JWT_SECRET);

const catchErrorMessage = err => Promise.reject(err.message);

declare var bootApp: any;
declare var execute: any;

bootApp(global);

const createUser = async data => {
  const result = await execute(
    `
      mutation CreateUser($data: UserInput!){
        createUser(data: $data) {
          id
          email
        }
      }
    `,
    { data }
  );

  return result.createUser;
};

describe("createUser mutation", () => {
  it("creates an user", async () => {
    const user = await createUser({
      email: "example@email.com",
      password: "1234"
    });

    expect(user.id).not.toBeUndefined();
    expect(user.email).toBe("example@email.com");
  });

  it("throws an error if email already exists", () => {
    const userData = { email: "example@email.com", password: "1234" };

    return expect(
      Promise.all([
        createUser(userData), // force line break
        createUser(userData)
      ]).catch(catchErrorMessage)
    ).rejects.toBe(
      'duplicate key value violates unique constraint "uk_user_email"'
    );
  });
});

describe("user query", () => {
  it("gets an user by id", async () => {
    const user = await createUser({
      email: "example@email.com",
      password: "1234"
    });

    const result = await execute(`
      {
        user(id: ${user.id}) {
          id
          email
        }
      }
    `);

    expect(result.user).toEqual(user);
  });
});

describe("users query", () => {
  it("lists all users", async () => {
    const users = [
      await createUser({ email: "example1@email.com", password: "1234" }),
      await createUser({ email: "example2@email.com", password: "1234" })
    ];

    const result = await execute(`
      {
        users {
          id
          email
        }
      }
    `);

    expect(result.users).toEqual(users);
  });
});

describe("login mutation ", () => {
  const userData = {
    email: "example@email.com",
    password: "1234"
  };

  let user;

  beforeEach(async () => {
    user = await createUser(userData);
  });

  it("returns a token", async () => {
    const { login } = await execute(`
      mutation {
        login(email: "${userData.email}", password: "${userData.password}")
      }
    `);

    expect(login).toBe(jwt(user.id));
  });

  it("throws an error if the credentials are wrong", () =>
    expect(
      execute(`
        mutation {
          login(email: "${userData.email}", password: "wrong password")
        }
      `).catch(catchErrorMessage)
    ).rejects.toBe("Unauthorized"));
});

describe("me query", () => {
  it("returns the logged user", async () => {
    const user = { id: 1, email: "some email" };
    const context = { user };

    const loggedUser = await execute(
      `
        {
          me {
            id
            email
          }
        }
      `,
      null,
      context
    );

    expect(loggedUser.me).toEqual(user);
  });

  it("throws an error if the token is missing or is invalid", () =>
    expect(
      execute(`
      {
        me {
          id
          email
        }
      }
    `).catch(catchErrorMessage)
    ).rejects.toBe("Unauthorized"));
});
