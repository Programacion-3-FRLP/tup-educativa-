import { Component, effect, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { StateManagerService } from '../../../core/state-manager.service';

@Component({
  selector: 'app-cuenta',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cuenta.html',
  styleUrl: './cuenta.css',
})
export class Cuenta implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly stateManager = inject(StateManagerService);

  readonly maxDireccion = 120;
  readonly maxTelefono = 15;
  readonly fechaMaxima = this.obtenerFechaActual();

  cuentaForm!: FormGroup;

  get user() {
    return this.stateManager.user();
  }

  constructor() {
    effect(() => {
      const currentUser = this.user;

      if (this.cuentaForm) {
        this.cuentaForm.patchValue({
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role,
        });
      }
    });
  }

  ngOnInit(): void {
    const controlesTelefonos = this.user.telefonos?.length
      ? this.user.telefonos.map((telefono) =>
          this.crearControlTelefono(telefono),
        )
      : [this.crearControlTelefono()];

    this.cuentaForm = this.fb.group({
      name: [{ value: this.user.name, disabled: true }],
      email: [{ value: this.user.email, disabled: true }],
      role: [{ value: this.user.role, disabled: true }],

      fechaNacimiento: [
        this.user.fechaNacimiento || '',
        [this.fechaNoFuturaValidator()],
      ],

      direccion: [
        this.user.direccion || '',
        [Validators.maxLength(this.maxDireccion)],
      ],

      telefonos: this.fb.array(controlesTelefonos),
    });
  }

  get telefonos(): FormArray {
    return this.cuentaForm.get('telefonos') as FormArray;
  }

  agregarTelefono(): void {
    this.telefonos.push(this.crearControlTelefono());
  }

  removerTelefono(index: number): void {
    if (this.telefonos.length > 1) {
      this.telefonos.removeAt(index);
    }
  }

  soloNumeros(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;

    const valorLimpio = input.value
      .replace(/\D/g, '')
      .slice(0, this.maxTelefono);

    input.value = valorLimpio;

    this.telefonos.at(index).setValue(valorLimpio, {
      emitEvent: false,
    });

    this.telefonos.at(index).markAsDirty();
  }

  guardar(): void {
    if (this.cuentaForm.invalid) {
      this.cuentaForm.markAllAsTouched();
      return;
    }

    const { fechaNacimiento, direccion, telefonos } =
      this.cuentaForm.getRawValue();

    this.stateManager.updateUser({
      fechaNacimiento,
      direccion,
      telefonos,
    });

    this.router.navigate(['/configuracion']);
  }

  cancelar(): void {
    this.router.navigate(['/configuracion']);
  }

  private crearControlTelefono(telefono = ''): FormControl<string | null> {
    return this.fb.control(telefono, [
      Validators.pattern(/^\d*$/),
      Validators.maxLength(this.maxTelefono),
    ]);
  }

  private fechaNoFuturaValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const fechaSeleccionada = control.value;

      if (!fechaSeleccionada) {
        return null;
      }

      return fechaSeleccionada > this.fechaMaxima
        ? { fechaFutura: true }
        : null;
    };
  }

  private obtenerFechaActual(): string {
    const fechaActual = new Date();

    const anio = fechaActual.getFullYear();
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const dia = String(fechaActual.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  }
}
