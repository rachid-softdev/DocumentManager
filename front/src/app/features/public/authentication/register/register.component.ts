import { Component, SecurityContext } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../../core/services/authentication/authentication.service';
import { UserStorageService } from '../../../../core/services/user-storage.service';
import { RegisterUserRequest } from '../../../../core/models/authentication/http/request/register-user-request.model';
import { BaseUserMapper } from '../../../../core/models/user/http/mapper/base-user-mapper.model';
import { RoleManager } from '../../../../core/constants/ERole';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [BaseUserMapper],
})
export class RegisterComponent {
  private _formGroup!: FormGroup;
  private _passwordTextType!: boolean;
  private _isSubmitted = false;
  private _isLoggedIn = false;
  private _isRegisterFailed = false;
  private _errorMessage: string | null = null;
  private _isSubmitRegisterUserButtonLoading: boolean = false;

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _sanitizer: DomSanitizer,
    private readonly _router: Router,
    private readonly _authenticationService: AuthenticationService,
    private readonly _tokenStorageService: UserStorageService,
    private readonly _userMapper: BaseUserMapper,
    private readonly _toastrService: ToastrService,
  ) {}

  public get getFormBuilder(): FormBuilder {
    return this._formBuilder;
  }

  public get getRouter(): Router {
    return this._router;
  }

  public get getAuthenticationService(): AuthenticationService {
    return this._authenticationService;
  }

  public get getTokenStorageService(): UserStorageService {
    return this._tokenStorageService;
  }

  public get getPasswordTextType(): boolean {
    return this._passwordTextType;
  }

  public get getIsSubmitRegisterUserButtonLoading(): boolean {
    return this._isSubmitRegisterUserButtonLoading;
  }

  ngOnInit(): void {
    this._formGroup = this._formBuilder.group({
      lastname: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(255),
          Validators.pattern(/^[a-zA-ZÀ-ÖØ-öø-ÿ '-]+$/),
        ],
      ],
      firstname: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(255),
          Validators.pattern(/^[a-zA-ZÀ-ÖØ-öø-ÿ '-]+$/),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8), // Minimum 8 caractères
          Validators.maxLength(255), // Maximum 255 caractères
          Validators.pattern(/(?=.*\d)/), // Au moins un chiffre
          Validators.pattern(/(?=.*[a-z])/), // Au moins une minuscule
          Validators.pattern(/(?=.*[A-Z])/), // Au moins une majuscule
          Validators.pattern(/(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])/), // Au moins un caractère spécial
        ],
      ],
    });
  }

  public get getForm(): FormGroup {
    return this._formGroup;
  }

  public get getFormControls() {
    return this.getForm.controls;
  }

  get getIsSubmitted(): boolean {
    return this._isSubmitted;
  }

  get getErrorMessage(): string | null {
    return this._errorMessage;
  }

  togglePasswordTextType() {
    this._passwordTextType = !this._passwordTextType;
  }

  onSubmit() {
    this._isSubmitted = true;
    this._isSubmitRegisterUserButtonLoading = true;
    if (this._formGroup.invalid) {
      this._isSubmitRegisterUserButtonLoading = false;
      return;
    }
    const firstname: string =
      this._sanitizer.sanitize(SecurityContext.HTML, this._formGroup.get('firstname')?.value) ?? '';
    const lastname: string =
      this._sanitizer.sanitize(SecurityContext.HTML, this._formGroup.get('lastname')?.value) ?? '';
    const email: string = this._sanitizer.sanitize(SecurityContext.HTML, this._formGroup.get('email')?.value) ?? '';
    const password: string =
      this._sanitizer.sanitize(SecurityContext.HTML, this._formGroup.get('password')?.value) ?? '';
    const registerUserRequest: RegisterUserRequest = new RegisterUserRequest(
      firstname,
      lastname,
      email,
      password,
      RoleManager.USER,
    );
    this.getAuthenticationService.register(registerUserRequest).subscribe({
      next: (user) => {
        if (user) {
          this._errorMessage = null;
          this._formGroup.reset();
          this._isSubmitted = false;
          this._isSubmitRegisterUserButtonLoading = false;
          this._toastrService.success(
            'Votre compte ' + user.getEmail + ' a été crée aves succès.',
            'Inscription effectuée',
          );
          this._router.navigate(['/login']);
        } else {
          this._errorMessage = 'Une erreur est survenue lors de votre inscription';
          this._isSubmitted = false;
          this._isSubmitRegisterUserButtonLoading = false;
          this._toastrService.error(this._errorMessage, 'Erreur');
        }
      },
      error: (error) => {
        console.log(error);
        if (error.status === 401) {
          this._errorMessage = 'Une erreur est survenue';
        } else {
          this._errorMessage =
            "Une erreur s'est produite lors de la connexion : (" + error?.status + ') - ' + error?.error?.message;
        }
        this._isSubmitted = false;
        this._isSubmitRegisterUserButtonLoading = false;
        this._toastrService.error(this._errorMessage, 'Erreur');
      },
    });
  }
}
