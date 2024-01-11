import { Injectable } from '@angular/core';

const EMAIL_TEMPLATE_KEY = 'email_template';

export enum EmailTemplateVariable {
  URL = 'URL',
  TITLE = 'TITLE',
  DESCRIPTION = 'DESCRIPTION',
}

@Injectable({
  providedIn: 'root',
})
export class EmailTemplateStorageService {
  private _variables: string[] = Object.values(EmailTemplateVariable);
  private _variableDelimiter: string = '$$';

  constructor() {}

  public get getVariables(): string[] {
    return this._variables;
  }

  public get getVariableDelimiter(): string {
    return this._variableDelimiter;
  }

  public get getDefaultTemplate(): string {
    return this.getVariables.map((variable) => this.variableFormat(variable)).join(' ');
  }

  public variableFormat(variableName: string): string {
    return this.getVariableDelimiter + variableName + this.getVariableDelimiter;
  }

  /**
   * Récupère le modèle de courrier électronique depuis sessionStorage.
   * @returns Le modèle de courrier électronique ou null s'il n'est pas trouvé.
   */
  public getEmailTemplate(): string | null {
    return window.sessionStorage.getItem(EMAIL_TEMPLATE_KEY) ?? this.getDefaultTemplate;
  }

  /**
   * Enregistre le modèle de courrier électronique dans sessionStorage.
   * @param template Le modèle de courrier électronique à enregistrer.
   */
  public saveEmailTemplate(template: string): void {
    window.sessionStorage.removeItem(EMAIL_TEMPLATE_KEY);
    window.sessionStorage.setItem(EMAIL_TEMPLATE_KEY, template);
  }

  /**
   * Supprime le modèle de courrier électronique de sessionStorage.
   */
  public removeEmailTemplate(): void {
    window.sessionStorage.removeItem(EMAIL_TEMPLATE_KEY);
  }
}
