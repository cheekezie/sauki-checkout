export const REGISTER_PAGES = [
  "/register",
  "/auth", 
  "/school-type",
  "/portal-membership",
  "/portal-identification",
  "/register-school",
] as const;

export const VERIFICATION_PAGES = [
  "/",
  "/auth",
  "/login",
  "/register",
  "/register-school",
  "/school-type",
  "/school-selection",
  "/portal-membership", 
  "/portal-identification",
  "/admin-otp",
  "/admin-verification",
  "/phone-verification",
  "/set-pass-pin",
] as const;

export const REMEMBER_PIN_PAGES = [
  "/reset-pin",
  "/forget-pin",
] as const;

export const SUPPORT_PAGES = [
  "/verification",
] as const;

export const isRouteInArray = (pathname: string, routes: readonly string[]): boolean => {
  return routes.includes(pathname);
};
