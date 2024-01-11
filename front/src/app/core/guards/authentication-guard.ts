import { inject } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router, CanActivateFn } from '@angular/router';
import { UserStorageService } from '../services/user-storage.service';
import { Role } from '../constants/ERole';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { UserResponse } from '../models/user/http/response/user-response.model';
import { BaseRoleResponse } from '../models/role/http/response/base-role-response.model';

/**
 * Source : https://angular.io/guide/router-tutorial-toh#canactivate-requiring-authentication
 */
export const AuthenticationGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  const authenticationService: AuthenticationService = inject(AuthenticationService);
  const user: UserResponse | null = authenticationService.getTokenStorageService.getUser();
  let isLoggedIn: boolean = user ? true : false;
  if (isLoggedIn) {
    const userRoles: BaseRoleResponse[] | null | undefined = user?.getRoles;
    if (
      !userRoles ||
      userRoles.length === 0 ||
      (route.data['role'] && !userRoles.some((role) => route.data['role'].includes(role.getName.toUpperCase())))
    ) {
      authenticationService.logout();
      router.navigate(['/login']);
      isLoggedIn = false;
      return false;
    }
    isLoggedIn = true;
    // Vérification de l'authentification au niveau de l'API
    authenticationService.isAuthenticated().subscribe({
      next: (isAuthenticated) => {
        /**
         * Ce implémentation s'exécute de manière asynchrone car c'est un appel vers l'api donc je fais quand même la redirection même
         * si le code après est déja exécuté
         */
        if (!isAuthenticated || !isLoggedIn) {
          authenticationService.logout();
          router.navigate(['/login']);
        }
      },
      error: (error) => {
        authenticationService.logout();
        router.navigate(['/login']);
      },
    });
    return true;
  }
  function generateSessionId() {
    return Math.floor(Math.random() * 1000000000) + 1;
  }
  const sessionId = generateSessionId();
  // Set our navigation extras object
  // that contains our global query params and fragment
  const navigationExtras: NavigationExtras = {
    queryParams: { session_id: sessionId },
    fragment: 'anchor',
  };
  authenticationService.logout();
  // Redirect to the login page with extras
  return router.createUrlTree(['/login'], navigationExtras);
};
