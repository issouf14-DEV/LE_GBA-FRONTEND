// Logs actifs uniquement en développement : rien ne fuit dans la console en production
const isDev = import.meta.env.DEV;
const noop = () => {};

export const logger = {
  info: isDev ? (message, data = '') => console.info(`[info] ${message}`, data) : noop,
  success: isDev ? (message, data = '') => console.info(`[ok] ${message}`, data) : noop,
  warning: isDev ? (message, data = '') => console.warn(`[warn] ${message}`, data) : noop,
  error: isDev ? (message, error = '') => console.error(`[error] ${message}`, error) : noop,
  debug: isDev ? (message, data = '') => console.debug(`[debug] ${message}`, data) : noop,
};

export default logger;
