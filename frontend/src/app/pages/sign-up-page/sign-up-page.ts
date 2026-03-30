import { DestroyRef, Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, filter, map, of, switchMap, tap } from 'rxjs';

type SignUpFieldId = 'fullName' | 'email' | 'cpf' | 'cep';

interface SignUpField {
  id: SignUpFieldId;
  label: string;
  placeholder: string;
  type: string;
  required: boolean;
}

interface ViaCepResponse {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
}

@Component({
  selector: 'app-sign-up-page',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up-page.html',
  styleUrl: './sign-up-page.css'
})

export class SignUpPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly httpClient = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly formFields: SignUpField[] = [
    {
      id: 'fullName',
      label: 'Nome Completo',
      placeholder: 'Digite seu nome completo',
      type: 'text',
      required: true
    },
    {
      id: 'email',
      label: 'E-mail',
      placeholder: 'Digite seu e-mail',
      type: 'email',
      required: true
    },
    {
      id: 'cpf',
      label: 'CPF (apenas números)',
      placeholder: 'Digite seu CPF',
      type: 'text',
      required: true
    },
    {
      id: 'cep',
      label: 'CEP',
      placeholder: 'Digite seu CEP',
      type: 'text',
      required: true
    }
  ];

  protected readonly signUpForm = this.formBuilder.nonNullable.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    cpf: ['', [Validators.required]],
    cep: ['', [Validators.required]],
    address: this.formBuilder.nonNullable.control({ value: '', disabled: true }, [Validators.required]),
    number: this.formBuilder.nonNullable.control({ value: '', disabled: true }, [Validators.required])
  });

  constructor() {
    this.autoFillAddressFromCep();
  }

  private autoFillAddressFromCep(): void {
    this.signUpForm.controls.cep.valueChanges
      .pipe(
        map((value) => value.replace(/\D/g, '')),
        debounceTime(250),
        distinctUntilChanged(),
        tap((cep) => {
          if (cep.length !== 8) {
            this.lockAddressFields();
          }
        }),
        filter((cep) => cep.length === 8),
        switchMap((cep) =>
          this.httpClient.get<ViaCepResponse>(`https://viacep.com.br/ws/${cep}/json/`).pipe(
            map((response) => this.buildAddress(response)),
            catchError(() => of(''))
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((address) => {
        if (!address) {
          this.lockAddressFields();
          return;
        }

        this.signUpForm.controls.address.enable({ emitEvent: false });
        this.signUpForm.controls.number.enable({ emitEvent: false });
        this.signUpForm.controls.address.setValue(address);
      });
  }

  private lockAddressFields(): void {
    this.signUpForm.controls.address.setValue('', { emitEvent: false });
    this.signUpForm.controls.number.setValue('', { emitEvent: false });
    this.signUpForm.controls.address.disable({ emitEvent: false });
    this.signUpForm.controls.number.disable({ emitEvent: false });
  }

  private buildAddress(response: ViaCepResponse): string {
    if (response.erro) {
      return '';
    }

    const street = response.logradouro?.trim() ?? '';
    const neighborhood = response.bairro?.trim() ?? '';
    const city = response.localidade?.trim() ?? '';
    const state = response.uf?.trim() ?? '';

    const segments = [street, neighborhood].filter(Boolean);
    const location = [city, state].filter(Boolean).join('/');

    if (location) {
      segments.push(location);
    }

    return segments.join(', ');
  }

  protected submit(): void {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    console.log('Create account attempt with:', this.signUpForm.getRawValue());
  }
}
