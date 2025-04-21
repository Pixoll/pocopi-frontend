import { Controller, Get } from "@nestjs/common";

@Controller("users")
export class UserController {
  @Get()
  getUsers() {
    return [
      { id: 1, name: "Alice", email: "alice@example.com" },
      { id: 2, name: "Bob", email: "bob@example.com" },
      { id: 3, name: "Charlie", email: "charlie@example.com" },
      { id: 4, name: "David", email: "david@example.com" },
      { id: 5, name: "Eve", email: "eve@example.com" },
      { id: 6, name: "Frank", email: "frank@example.com" },
    ];
  }
}
