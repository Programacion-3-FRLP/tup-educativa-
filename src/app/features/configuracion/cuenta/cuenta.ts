import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
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
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private stateManager = inject(StateManagerService);

  cuentaForm!: FormGroup;

  get user() {
    return this.stateManager.user();
  }

  ngOnInit() {
    this.cuentaForm = this.fb.group({
      name: [{ value: this.user.name, disabled: true }],
      email: [{ value: this.user.email, disabled: true }],
      role: [{ value: this.user.role, disabled: true }],

      fechaNacimiento: [this.user.fechaNacimiento || ''],
      direccion: [this.user.direccion || ''],
      telefonos: this.fb.array([]),
    });

    if (this.user.telefonos && this.user.telefonos.length > 0) {
      this.user.telefonos.forEach((tel: string) => {
        this.telefonos.push(this.fb.control(tel));
      });
    } else {
      this.telefonos.push(this.fb.control(''));
    }
  }

  get telefonos(): FormArray {
    return this.cuentaForm.get('telefonos') as FormArray;
  }

  agregarTelefono() {
    this.telefonos.push(this.fb.control(''));
  }

  removerTelefono(index: number) {
    this.telefonos.removeAt(index);
  }

  guardar() {
    const datosModificados = this.cuentaForm.getRawValue();
    this.stateManager.updateUser(datosModificados);

    console.log('Datos guardados con éxito:', datosModificados);
    this.router.navigate(['/configuracion']);
  }

  cancelar() {
    this.router.navigate(['/configuracion']);
  }
}
