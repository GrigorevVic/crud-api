import { createServer } from "http";
import dotenv from "dotenv";
dotenv.config();

interface User {
  id: String;
  username?: String;
  age?: Number;
  hobbies?: String[];
}

const users: User[] = [];
let id = 1;

const server = createServer(async (request, response) => {
  const { method, url } = request;
  response.setHeader("Content-Type", "application/json");
  if (url) {
    // GET
    if (method === "GET" && url === "/api/users") {
      response.writeHead(200);
      response.end(JSON.stringify(users));

      // GET{id}
    } else if (method === "GET" && url.startsWith("/api/users")) {
      const userId = Number(url.split("/").at(-1));
      const user = users.find((user) => Number(user.id) === userId);
      if (user) {
        response.writeHead(200);
        response.end(JSON.stringify(user));
      } else {
        response.writeHead(404);
        response.end(JSON.stringify({ message: "user not found" }));
      }

      // POST
    } else if (method === "POST" && url === "/api/users") {
      let body = "";
      request.on("data", (chunk) => (body += chunk.toString()));

      request.on("end", () => {
        const user = JSON.parse(body);
        if (
          user.hasOwnProperty("username") &&
          user.hasOwnProperty("age") &&
          user.hasOwnProperty("hobbies")
        ) {
          user.id = id++;
          users.push(user);
          response.writeHead(201);
          response.end(JSON.stringify(user));
        } else {
          response.writeHead(400);
          response.end(
            JSON.stringify({ message: "does not contain all requestuired fields" })
          );
        }
        
      });

      // PUT{id}
    } else if (method === "PUT" && url.startsWith("/api/users")) {
      const userId = Number(url.split("/").at(-1));
      let body = "";
      request.on("data", (chunk) => (body += chunk.toString()));
      request.on("end", () => {
        const updatedUser = JSON.parse(body);
        const index = users.findIndex((user) => Number(user.id) === userId);
        if (index !== -1) {
          users[index] = { id: userId, ...updatedUser };
          response.writeHead(200);
          response.end(JSON.stringify(users[index]));
        } else {
          response.writeHead(404);
          response.end(JSON.stringify({ message: "user not found" }));
        }
      });

      // DELETE{id}
    } else if (method === "DELETE" && url.startsWith("/api/users")) {
      const userId = Number(url.split("/").at(-1));
      const index = users.findIndex((user) => Number(user.id) === userId);
      if (index !== -1) {
        users.splice(index, 1);
        response.writeHead(204);
        response.end();
      } else {
        response.writeHead(404);
        response.end(JSON.stringify({ message: "user not found" }));
      }

      // 404
    } else {
      response.writeHead(404);
      response.end(JSON.stringify({ message: "unknown route" }));
    }
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`server started: ${PORT}`);
});

export default server;
