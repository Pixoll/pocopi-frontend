import { ConflictException, Injectable } from "@nestjs/common";
import { config } from "@pocopi/config";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { User } from "./entities";

const USERS_DIR = path.join(__dirname, "../../../data/users");

@Injectable()
export class UsersService {
    private readonly users: Map<string, User>;

    public constructor() {
        this.users = this.readUsers();
    }

    public saveUser(user: User): void {
        this.saveUserToFile(user);
        this.users.set(user.id, user);
    }

    public getUsers(): Map<string, User> {
        return this.users;
    }

    private readUsers(): Map<string, User> {
        if (!existsSync(USERS_DIR)) {
            mkdirSync(USERS_DIR, { recursive: true });
            return new Map();
        }

        const fileNames = readdirSync(USERS_DIR);
        const users = new Map<string, User>();

        for (const filename of fileNames) {
            const filePath = path.join(USERS_DIR, filename);
            const content = readFileSync(filePath, "utf-8");
            try {
                const user: User = JSON.parse(content);
                users.set(user.id, user);
            } catch (error) {
                console.error(`Error parsing file ${filename}:`, error);
            }
        }

        return users;
    }

    private saveUserToFile(user: User): void {
        const filename = `${user.id}.json`;
        const filePath = path.join(USERS_DIR, filename);

        if (existsSync(filePath)) {
            throw new ConflictException(config.t("backend.userAlreadyExists", user.id));
        }

        writeFileSync(filePath, JSON.stringify(user), "utf-8");
    }
}
