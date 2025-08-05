export enum RoutePath {
  Home = '/',
  Login = '/login',
  Register = '/register',
  Profile = '/profile',
  Logout = '/logout',
}

export const getVerifyEmailPath = (id: string) => `/verify/${id}`;
export const getLoginRedirectFrom = (pathname: string) => `${RoutePath.Login}?redirectFrom=${pathname}`;
