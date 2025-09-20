import { UserAttributes } from "@/models/user";
export type CreateUserPayload = Pick<UserAttributes, "name" | "email">;
