import { AbstractControl, ValidatorFn } from '@angular/forms';

export function addressValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const addressPattern = /^[a-zA-Z0-9\/,\- ]*$/;
    const isValid = addressPattern.test(control.value);
    return isValid ? null : { 'invalidAddress': true };
  };
}

export function firstCharNotSpaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value.charAt(0) === ' ') {
        return { 'firstCharSpace': true };
      }
      return null;
    };
  }

  export function noSpacesValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      if (control.value && (control.value as string).indexOf(' ') >= 0) {
        return { 'noSpaces': true }; // Invalid
      }
      return null; // Valid
    };
  }

  export function maxLengthValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      if (control.value && (control.value as string).length < 10 || (control.value as string).length > 10) {
        return { 'maxLen': true }; // Invalid
      }
      return null; // Valid
    };
  }

  export function maxLengthValidatorForPin(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      if (control.value && (control.value as string).length < 5 || (control.value as string).length > 5) {
        return { 'maxLenPin': true }; // Invalid
      }
      return null; // Valid
    };
  }

  // export function symbolsOnly(): ValidatorFn {
  //   return (control: AbstractControl): {[key: string]: any} | null => {
  //     if ( !/^[^`~!@#$%\^&*()_+={}|[\]\\:';"<>?,./]*$/.test(control.value)) {
  //       return { 'symbols': true };
  //     }
  //     return null;
  //   }
  // }
  export function symbolsOnly(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      if (control.value && !/^[^`~!@#$%\^&*()_+={}|[\]\\:';"<>?,./]*$/.test(control.value)) {
        control.setErrors({ 'symbols': true });
      } else {
        control.setErrors(null);
      }
      return null;
    }
  }
  
  export function handleKeyPress(event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement;
    const currentValue = inputElement.value;
    const charCode = event.charCode;
  
    if (charCode === 32 && currentValue.length === 0) {
      event.preventDefault();
    }
  }
  // export function symbolsOnly1(control: AbstractControl) {
  //   if ( !/^[^`~!@#$%\^&*()_+={}|[\]\\:';"<>?,./]*$/.test(control.value)) {
  //     return { symbols: true };
  //   }
  //   return null;
  //   }