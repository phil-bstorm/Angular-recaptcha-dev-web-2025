import { JwtPayload } from 'jwt-decode';

export interface LoginResponse {
  accessToken: string;
}

export interface JwtDecoded extends JwtPayload {
  role: string;
}

export interface RegisterData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}
