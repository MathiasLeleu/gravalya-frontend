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

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role: "user" | "admin";
  };
}