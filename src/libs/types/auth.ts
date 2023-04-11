export declare type User = {
  id: string;
  email: string;
};

export declare type AuthContextType = {
  user: any;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export declare type LoginResponse = {
  access_token: string;
  expires_in?: number;
  id_token?: string;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
}
