export enum RoutePath {
  Home = '/',
  Login = '/login',
  Register = '/register',
  Profile = '/profile',
  Logout = '/logout',
}

export const getVerifyEmailPath = (id: string) => `/verify/${id}`;
