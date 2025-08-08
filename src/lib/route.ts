export enum RoutePath {
  Home = '/',
  Login = '/login',
  Register = '/register',
  Profile = '/profile',
  Logout = '/logout',
  Verify = '/verify',
}

// ✅ Login status query param
export enum LoginStatus {
  Activated = 'activated',
  Expired = 'expired',
  Error = 'error',
  EmailVerified = 'emailVerified',
  PasswordChanged = 'passwordChanged',
}

export const AUTH_ROUTES: string[] = [RoutePath.Login, RoutePath.Register, RoutePath.Verify];
export const PRIVATE_ROUTES: string[] = [RoutePath.Profile];

// ✅ Verify email path with user ID
export const getVerifyEmailPath = (id: string) => `${RoutePath.Verify}/${id}`;

// ✅ Redirect to login with optional status
export const getLoginPath = (options?: { redirectFrom?: string; status?: LoginStatus }): string => {
  const params = new URLSearchParams();

  if (options?.redirectFrom) {
    params.set('redirectFrom', options.redirectFrom);
  }

  if (options?.status) {
    params.set('status', options.status);
  }

  return `${RoutePath.Login}${params.toString() ? `?${params.toString()}` : ''}`;
};

export const resolveRedirectUrl = (
  redirect: unknown,
  defaultUrl: string,
  options?: {
    blocked?: string[];
    normalize?: boolean;
  }
): string => {
  // Ensure redirect is a string
  if (typeof redirect !== 'string') return defaultUrl;

  // Normalize if requested
  const normalized = options?.normalize ? redirect.toLowerCase().replace(/\/$/, '') : redirect;

  // Check for blocked redirects
  const blockedSet = new Set(options?.blocked ?? [RoutePath.Logout]);
  if (normalized === '' || blockedSet.has(normalized)) {
    return defaultUrl;
  }

  return redirect;
};
