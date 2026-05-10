import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador de CPF (algoritmo dos dígitos verificadores).
 * Aceita string com qualquer máscara — só os dígitos contam.
 * Retorna `{ cpfInvalid: true }` quando inválido.
 */
export const cpfValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const valor = (control.value ?? '').toString();
  if (valor.trim() === '') {
    return null;
  }

  const digitos = valor.replace(/\D/g, '');

  if (digitos.length !== 11 || /^(\d)\1{10}$/.test(digitos)) {
    return { cpfInvalid: true };
  }

  if (!conferirDigitoVerificador(digitos, 9) || !conferirDigitoVerificador(digitos, 10)) {
    return { cpfInvalid: true };
  }

  return null;
};

function conferirDigitoVerificador(digitos: string, ate: number): boolean {
  let soma = 0;
  for (let i = 0; i < ate; i++) {
    soma += Number(digitos.charAt(i)) * (ate + 1 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10) {
    resto = 0;
  }
  return resto === Number(digitos.charAt(ate));
}
