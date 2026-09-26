export interface IRegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IRegisterResponse {
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "admin";
}