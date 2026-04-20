import { HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs';
import { ClienteService } from '../../services/cliente.service';
import { ViaCepService } from '../../services/viacep.service';

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
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly viaCep = inject(ViaCepService);
  private readonly clientes = inject(ClienteService);
  private readonly router = inject(Router);

  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);

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
    cpf: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(14)]],
    phone: ['', [Validators.required, Validators.minLength(14)]],
    cep: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
    address: this.formBuilder.nonNullable.control({ value: '', disabled: true }, [Validators.required]),
    number: this.formBuilder.nonNullable.control({ value: '', disabled: true }, [Validators.required, Validators.maxLength(20)])
  });

  private cidadeViaCep = '';
  private estadoViaCep = '';

  constructor() {
    this.configurarMascaras();
    this.autoFillAddressFromCep();
  }

  protected submit(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);

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
        cidade: this.cidadeViaCep,
        estado: this.estadoViaCep
      })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.successMessage.set(
            'Conta criada com sucesso! Uma senha de 4 dígitos foi enviada ao seu e-mail.'
          );
          setTimeout(() => {
            void this.router.navigateByUrl('/login');
          }, 2500);
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

        const ruaMontada = [endereco.logradouro, endereco.bairro]
          .filter(Boolean)
          .join(', ');

        this.signUpForm.controls.address.enable({ emitEvent: false });
        this.signUpForm.controls.number.enable({ emitEvent: false });
        this.signUpForm.controls.address.setValue(ruaMontada, { emitEvent: false });
        this.errorMessage.set(null);
      });
  }

  private lockAddressFields(): void {
    this.cidadeViaCep = '';
    this.estadoViaCep = '';
    this.signUpForm.controls.address.setValue('', { emitEvent: false });
    this.signUpForm.controls.number.setValue('', { emitEvent: false });
    this.signUpForm.controls.address.disable({ emitEvent: false });
    this.signUpForm.controls.number.disable({ emitEvent: false });
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
