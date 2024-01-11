/**
 * Source : https://angular.io/guide/build
 */
export const environment = {
  production: false,
  apiUrl:
    import.meta.env['NG_API_BASE_URL'] ||
    'https://localhost:443/api/document_manager',
};
