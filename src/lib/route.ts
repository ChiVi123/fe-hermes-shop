// TODO: should refactor as file route.local.ts
export enum RoutePath {
  Home = '/',
  Login = '/login',
  Register = '/register',
  Profile = '/profile',
  Logout = '/logout',
}

export const getVerifyEmailPath = (id: string) => `/verify/${id}`;
export const getLoginRedirectFrom = (pathname: string) => `${RoutePath.Login}?redirectFrom=${pathname}`;
export const getLoginAfterActivateAgain = () => `${RoutePath.Login}?activate=true`;
