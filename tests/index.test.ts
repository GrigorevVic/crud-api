import request from "supertest";
import server from "../src/index.ts";

const user = {
  id: 1,
  username: "Max",
  age: "20",
  hobbies: ["Hunting", "music"],
};

const updateUser = {
  id: 1,
  username: "Max",
  age: "40",
  hobbies: ["Hunting", "music"],
};

describe("/api/users", () => {
  test("an empty array is expected", async () => {
    const response = await request(server).get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("a response containing newly created record is expected", async () => {
    const response = await request(server)
      .post("/api/users")
      .send(user)
      .set("Accept", "application/json");

    expect(response.status).toBe(201);
    expect(response.body).toEqual(user);
  });

  test("the created record is expected", async () => {
    const response = await request(server).get("/api/users/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(user);
  });

  test("a response is expected containing an updated object with the same id", async () => {
    const response = await request(server)
      .put("/api/users/1")
      .send(updateUser)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(updateUser);
  });

  test("confirmation of successful deletion is expected", async () => {
    const response = await request(server).delete("/api/users/1");
    expect(response.status).toBe(204);
  });

  test("expected answer is that there is no such object", async () => {
    const response = await request(server).get("/api/users/1");
    expect(response.status).toBe(404);
  });
});
