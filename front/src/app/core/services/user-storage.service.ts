import { Injectable } from '@angular/core';
import { UserResponse } from '../models/user/http/response/user-response.model';
import { BaseRoleResponse } from '../models/role/http/response/base-role-response.model';

const TOKEN_KEY = 'authentication_token';
const USER_KEY = 'authentication_user';

@Injectable()
export class UserStorageService {
  constructor() {}

  /**
   * Enregistre le jeton d'authentification dans sessionStorage.
   * @param token Le jeton d'authentification à enregistrer.
   */
  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  /**
   * Supprime le jeton d'authentification de sessionStorage.
   */
  public removeToken(): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
  }

  /**
   * Efface toutes les données de session stockées.
   */
  public clearToken(): void {
    window.sessionStorage.clear();
  }

  /**
   * Récupère le jeton d'authentification de sessionStorage.
   * @returns Le jeton d'authentification ou null s'il n'est pas trouvé.
   */
  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  /**
   * Récupère les informations de l'utilisateur depuis sessionStorage.
   * @return Les informations de l'utilisateur ou null s'il n'est pas trouvé.
   */
  public getUser(): UserResponse | null {
    const userItem = window.sessionStorage.getItem(USER_KEY);
    if (userItem) {
      const userParsed: any = JSON.parse(userItem);
      let user: UserResponse = new UserResponse();
      user = Object.assign(user, userParsed);
      if (Array.isArray(userParsed._roles)) {
        user.setRoles = userParsed._roles.map((role: any) => {
          const baseRole = new BaseRoleResponse();
          return Object.assign(baseRole, role);
        });
      }
      /**
       * Création de l'objet car dans la méthode JSON.parse, elle ne restaure pas les get et set
       * Source : https://stackoverflow.com/questions/50772972/why-getters-setters-are-missing-after-stringifying-and-parsing-back-to-an-object
       */
      return user;
    }
    return null;
  }

  /**
   * Enregistre les informations de l'utilisateur dans sessionStorage.
   * @param user Les informations de l'utilisateur à enregistrer.
   */
  public saveUser(user: UserResponse): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}
