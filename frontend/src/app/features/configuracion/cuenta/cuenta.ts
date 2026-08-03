import { Component, inject, OnInit, effect } from '@angular/core';
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

  constructor() {
    effect(() => {
      const currentUser = this.user;
      if (this.cuentaForm) {
        this.cuentaForm.patchValue({
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role
        });
      }
    });
  }

  ngOnInit() {
    this.cuentaForm = this.fb.group({
      name: [{ value: this.user.name, disabled: true }],
      email: [{ value: this.user.email, disabled: true }],
      role: [{ value: this.user.role, disabled: true }],

      fechaNacimiento: [this.user.fechaNacimiento || ''],
      direccion: [this.user.direccion || ''],
      telefonos: this.fb.array(this.user.telefonos?.length ? this.user.telefonos.map(t => this.fb.control(t)) : [this.fb.control('')]),
    });
  }

  get telefonos(): FormArray {
    return this.cuentaForm.get('telefonos') as FormArray;
  }

  agregarTelefono() {
    this.telefonos.push(this.fb.control(''));
  }

  removerTelefono(index: number) {
    if (this.telefonos.length > 1) {
      this.telefonos.removeAt(index);
    }
  }

  guardar() {
    this.stateManager.updateUser(this.cuentaForm.getRawValue());
    console.log('Datos guardados con éxito:', this.cuentaForm.getRawValue());
    this.router.navigate(['/configuracion']);
  }

  cancelar() {
    this.router.navigate(['/configuracion']);
  }
}
