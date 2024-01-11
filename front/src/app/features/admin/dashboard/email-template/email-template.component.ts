import { Component, OnDestroy, OnInit, SecurityContext } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { EmailTemplateStorageService } from '../../../../core/services/mail/email-storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-email-template',
  templateUrl: './email-template.component.html',
  styleUrls: ['./email-template.component.css'],
})
export class EmailTemplateComponent implements OnInit, OnDestroy {
  private _emailForm: FormGroup;

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _sanitizer: DomSanitizer,
    private readonly _emailTemplateStorageService: EmailTemplateStorageService,
    private readonly _toastrService: ToastrService,
  ) {
    this._emailForm = this._formBuilder.group({});
  }

  ngOnInit(): void {
    const templateVariables: string =
      this._emailTemplateStorageService.getEmailTemplate() ?? this._emailTemplateStorageService.getDefaultTemplate;
    this._emailForm = this._formBuilder.group({
      template: [this.replaceLineBreaks(templateVariables), [Validators.required]],
    });
  }

  ngOnDestroy(): void {}

  /**
   * Remplace les sauts de ligne HTML et les retours chariot par des caractères de nouvelle ligne.
   * @param {string} input - La chaîne d'entrée contenant des sauts de ligne HTML et des retours chariot.
   * @returns {string} - La chaîne modifiée avec les sauts de ligne remplacés.
   */
  public replaceLineBreaks(input: string): string {
    return input.replace(/<br *\/?>/gi, '\n').replace(/\r?\n/g, '\n');
  }

  public get getEmailForm(): FormGroup {
    return this._emailForm;
  }

  public get getVariables(): string[] {
    return this._emailTemplateStorageService.getVariables;
  }

  public get getPrefixVariable() {
    return this._emailTemplateStorageService.getVariableDelimiter;
  }

  public variableFormat(variableName: string): string {
    return this._emailTemplateStorageService.variableFormat(variableName);
  }

  public onSubmit(): void {
    if (this._emailForm.invalid) {
      this._toastrService.error('Le formulaire du modèle de template est invalide', 'Formulaire invalide');
      return;
    }
    let template: string = this._emailForm.get('template')?.value ?? '';
    template = template.replace(/\n/g, '<br>');
    template = this._sanitizer.sanitize(SecurityContext.HTML, template) ?? '';
    this._emailTemplateStorageService.saveEmailTemplate(template);
    // this._emailTemplateStorageService.saveEmailTemplate(template);
    this._toastrService.success("Le modèle de template pour le format d'email est enregistré", 'Formulaire invalide');
  }

  onVariableSelected(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement)?.value;
    if (selectedValue) {
      const currentCommentValue = this._emailForm.get('template')?.value;
      const updatedCommentValue = currentCommentValue + ' ' + selectedValue;
      this._emailForm.get('template')?.setValue(updatedCommentValue);
    }
  }
}
