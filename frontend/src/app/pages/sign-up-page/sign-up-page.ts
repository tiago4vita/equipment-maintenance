import { HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs';
import { ClienteService } from '../../services/cliente.service';
import { ViaCepService } from '../../services/viacep.service';
import { ToastService } from '../../toast.service';
import { AUTH_BRAND_LOGO_ALT } from '../../constants/auth-brand.constants';
import { cpfValidator } from '../../validators/cpf.validator';

type SignUpFieldId = 'fullName' | 'email' | 'cpf' | 'phone' | 'cep';

interface SignUpField {
  id: SignUpFieldId;
  label: string;
  placeholder: string;
  type: string;
  required: boolean;
  maxLength?: number;
  inputMode?: string;
}

@Component({
  selector: 'app-sign-up-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up-page.html',
  styleUrl: './sign-up-page.css'
})
export class SignUpPageComponent {
  protected readonly brandLogoAlt = AUTH_BRAND_LOGO_ALT;

  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly viaCep = inject(ViaCepService);
  private readonly clientes = inject(ClienteService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly formFields: SignUpField[] = [
    { id: 'fullName', label: 'Nome Completo', placeholder: 'Digite seu nome completo', type: 'text', required: true },
    { id: 'email', label: 'E-mail', placeholder: 'Digite seu e-mail', type: 'email', required: true },
    { id: 'cpf', label: 'CPF', placeholder: '000.000.000-00', type: 'text', required: true, maxLength: 14, inputMode: 'numeric' },
    { id: 'phone', label: 'Telefone', placeholder: '(00) 00000-0000', type: 'text', required: true, maxLength: 15, inputMode: 'tel' },
    { id: 'cep', label: 'CEP', placeholder: '00000-000', type: 'text', required: true, maxLength: 9, inputMode: 'numeric' }
  ];

  protected readonly signUpForm = this.formBuilder.nonNullable.group({
    fullName: ['', [Validators.required, Validators.maxLength(200)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
    cpf: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(14), cpfValidator]],
    phone: ['', [Validators.required, Validators.minLength(14)]],
    cep: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
    address: this.formBuilder.nonNullable.control({ value: '', disabled: true }, [Validators.required, Validators.maxLength(200)]),
    number: this.formBuilder.nonNullable.control({ value: '', disabled: true }, [Validators.required, Validators.maxLength(20)]),
    bairro: this.formBuilder.nonNullable.control({ value: '', disabled: true }, [Validators.required, Validators.maxLength(100)]),
    complemento: this.formBuilder.nonNullable.control({ value: '', disabled: true }, [Validators.maxLength(150)])
  });

  private static readonly LABEL_POR_CAMPO: Record<string, string> = {
    fullName: 'Nome completo',
    email: 'E-mail',
    cpf: 'CPF',
    phone: 'Telefone',
    cep: 'CEP',
    address: 'Endereço',
    number: 'Número',
    bairro: 'Bairro',
    complemento: 'Complemento'
  };

  private cidadeViaCep = '';
  private estadoViaCep = '';

  constructor() {
    this.configurarMascaras();
    this.autoFillAddressFromCep();
  }

  protected mensagemErro(fieldId: string, errors: ValidationErrors | null): string {
    if (!errors) return '';
    const label = SignUpPageComponent.LABEL_POR_CAMPO[fieldId] ?? 'Campo';
    if (errors['required']) return `${label} é obrigatório.`;
    if (errors['email']) return 'Informe um e-mail válido.';
    if (errors['cpfInvalid']) return 'CPF inválido.';
    if (errors['minlength']) {
      if (fieldId === 'cpf') return 'CPF incompleto.';
      if (fieldId === 'phone') return 'Telefone incompleto.';
      if (fieldId === 'cep') return 'CEP incompleto.';
      return `${label} muito curto.`;
    }
    if (errors['maxlength']) return `${label} excede o tamanho máximo permitido.`;
    return `${label} inválido.`;
  }

  protected submit(): void {
    this.errorMessage.set(null);

    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    const raw = this.signUpForm.getRawValue();
    this.submitting.set(true);

    this.clientes
      .criar({
        nome: raw.fullName.trim(),
        email: raw.email.trim(),
        cpf: raw.cpf,
        telefone: raw.phone,
        cep: raw.cep,
        rua: raw.address.trim(),
        numero: raw.number.trim(),
        bairro: raw.bairro.trim(),
        complemento: raw.complemento.trim() || undefined,
        cidade: this.cidadeViaCep,
        estado: this.estadoViaCep
      })
      .subscribe({
        next: (res) => {
          this.submitting.set(false);

          // Removemos a lógica que capturava a senha e a exibia no texto
          this.toast.show(
            'Conta criada com sucesso! Verifique seu e-mail para acessar sua senha.'
          );

          setTimeout(() => {
            void this.router.navigateByUrl('/login');
          }, 3000);
        },
        error: (err: HttpErrorResponse) => {
          this.submitting.set(false);
          const body = err.error as { message?: string } | undefined;
          this.errorMessage.set(
            body?.message ?? 'Não foi possível concluir o cadastro. Tente novamente.'
          );
        }
      });
  }

  private configurarMascaras(): void {
    this.signUpForm.controls.cpf.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        const formatado = this.formatarCpf(value);
        if (formatado !== value) {
          this.signUpForm.controls.cpf.setValue(formatado, { emitEvent: false });
        }
      });

    this.signUpForm.controls.phone.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        const formatado = this.formatarTelefone(value);
        if (formatado !== value) {
          this.signUpForm.controls.phone.setValue(formatado, { emitEvent: false });
        }
      });

    this.signUpForm.controls.cep.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        const formatado = this.formatarCep(value);
        if (formatado !== value) {
          this.signUpForm.controls.cep.setValue(formatado, { emitEvent: false });
        }
      });
  }

  private autoFillAddressFromCep(): void {
    this.signUpForm.controls.cep.valueChanges
      .pipe(
        map((value) => (value ?? '').replace(/\D/g, '')),
        debounceTime(300),
        distinctUntilChanged(),
        tap((cep) => {
          if (cep.length !== 8) {
            this.lockAddressFields();
          }
        }),
        filter((cep) => cep.length === 8),
        switchMap((cep) => this.viaCep.consultar(cep)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((endereco) => {
        if (!endereco) {
          this.lockAddressFields();
          this.errorMessage.set('CEP não encontrado. Verifique e tente novamente.');
          return;
        }

        this.cidadeViaCep = endereco.cidade;
        this.estadoViaCep = endereco.estado;

        this.signUpForm.controls.address.enable({ emitEvent: false });
        this.signUpForm.controls.number.enable({ emitEvent: false });
        this.signUpForm.controls.bairro.enable({ emitEvent: false });
        this.signUpForm.controls.complemento.enable({ emitEvent: false });
        this.signUpForm.controls.address.setValue(endereco.logradouro, { emitEvent: false });
        this.signUpForm.controls.bairro.setValue(endereco.bairro, { emitEvent: false });
        this.errorMessage.set(null);
      });
  }

  private lockAddressFields(): void {
    this.cidadeViaCep = '';
    this.estadoViaCep = '';
    this.signUpForm.controls.address.setValue('', { emitEvent: false });
    this.signUpForm.controls.number.setValue('', { emitEvent: false });
    this.signUpForm.controls.bairro.setValue('', { emitEvent: false });
    this.signUpForm.controls.complemento.setValue('', { emitEvent: false });
    this.signUpForm.controls.address.disable({ emitEvent: false });
    this.signUpForm.controls.number.disable({ emitEvent: false });
    this.signUpForm.controls.bairro.disable({ emitEvent: false });
    this.signUpForm.controls.complemento.disable({ emitEvent: false });
  }

  private formatarCpf(valor: string): string {
    const digitos = (valor ?? '').replace(/\D/g, '').slice(0, 11);
    if (digitos.length <= 3) return digitos;
    if (digitos.length <= 6) return `${digitos.slice(0, 3)}.${digitos.slice(3)}`;
    if (digitos.length <= 9) return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6)}`;
    return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6, 9)}-${digitos.slice(9)}`;
  }

  private formatarTelefone(valor: string): string {
    const digitos = (valor ?? '').replace(/\D/g, '').slice(0, 11);
    if (digitos.length <= 2) return digitos.length ? `(${digitos}` : '';
    if (digitos.length <= 6) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
    if (digitos.length <= 10) {
      return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
    }
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
  }

  private formatarCep(valor: string): string {
    const digitos = (valor ?? '').replace(/\D/g, '').slice(0, 8);
    if (digitos.length <= 5) return digitos;
    return `${digitos.slice(0, 5)}-${digitos.slice(5)}`;
  }
}
