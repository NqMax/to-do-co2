import { client } from "@/lib/httpClient";
import type {
  CreateUserDto,
  LoginDto,
  AuthResponse,
} from "@/features/auth/types";
import type { AxiosResponse } from "axios";

export async function deleteSession() {
  const response = await client.post("/auth/logout");
  return response.data;
}

export async function validateSession() {
  const response = await client.get<AuthResponse, AxiosResponse<AuthResponse>>(
    "/auth/me",
  );
  return response.data;
}

export async function registerUser(data: CreateUserDto) {
  const response = await client.post<
    AuthResponse,
    AxiosResponse<AuthResponse>,
    CreateUserDto
  >("/users", data);
  return response.data;
}

export async function validateUser(data: LoginDto) {
  const response = await client.post<
    AuthResponse,
    AxiosResponse<AuthResponse>,
    LoginDto
  >("/auth/login", data);
  return response.data;
}
