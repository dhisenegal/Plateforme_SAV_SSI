/**
 * un tableau de routes accessibles au public
 * ces routes ne nécessitent pas du tout de s'authentifier
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
];

/**
 * un tableau de routes non accessibles au public
 * ces routes nécessitent de s'authentifier
 * et redirigent les utilisateurs connectés vers settings
 * @type {string[]}
 */

export const authRoutes = [
  "/auth/login",
  "/auth/register",
];
/**
 * un string qui contient le préfixe des routes 
 * d'authentifications
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth"
/**
 * un string qui contient la redirection des 
 * utilisateurs aprés authentification
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/admin"