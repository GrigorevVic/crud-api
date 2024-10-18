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

const server = createServer(async (req, res) => {
  const { method, url } = req;
  res.setHeader("Content-Type", "application/json");
  if (url) {
    // GET
    if (method === "GET" && url === "/api/users") {
      res.writeHead(200);
      res.end(JSON.stringify(users));

      // GET{id}
    } else if (method === "GET" && url.startsWith("/api/users")) {
      const userId = Number(url.split("/").at(-1));
      const user = users.find((user) => Number(user.id) === userId);
      if (user) {
        res.writeHead(200);
        res.end(JSON.stringify(user));
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: "user not found" }));
      }

      // POST
    } else if (method === "POST" && url === "/api/users") {
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));

      req.on("end", () => {
        const user = JSON.parse(body);
        if (
          user.hasOwnProperty("username") &&
          user.hasOwnProperty("age") &&
          user.hasOwnProperty("hobbies")
        ) {
          user.id = id++;
          users.push(user);
          res.writeHead(201);
          res.end(JSON.stringify(user));
        } else {
          res.writeHead(400);
          res.end(
            JSON.stringify({ message: "does not contain all required fields" })
          );
        }
        
      });

      // PUT{id}
    } else if (method === "PUT" && url.startsWith("/api/users")) {
      const userId = Number(url.split("/").at(-1));
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));
      req.on("end", () => {
        const updatedUser = JSON.parse(body);
        const index = users.findIndex((user) => Number(user.id) === userId);
        if (index !== -1) {
          users[index] = { id: userId, ...updatedUser };
          res.writeHead(200);
          res.end(JSON.stringify(users[index]));
        } else {
          res.writeHead(404);
          res.end(JSON.stringify({ message: "user not found" }));
        }
      });

      // DELETE{id}
    } else if (method === "DELETE" && url.startsWith("/api/users")) {
      const userId = Number(url.split("/").at(-1));
      const index = users.findIndex((user) => Number(user.id) === userId);
      if (index !== -1) {
        users.splice(index, 1);
        res.writeHead(204);
        res.end();
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: "user not found" }));
      }

      // 404
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ message: "unknown route" }));
    }
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`server started: ${PORT}`);
});

export default server;
