import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';

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

  cuentaForm!: FormGroup;

  user = {
    name: 'Ignacio Echave',
    email: 'ignacio@email.com',
    role: 'Administrador',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  };

  ngOnInit() {
    this.cuentaForm = this.fb.group({
      name: [{ value: this.user.name, disabled: true }],
      email: [{ value: this.user.email, disabled: true }],
      role: [{ value: this.user.role, disabled: true }],

      fechaNacimiento: [''],
      direccion: [''],
      telefonos: this.fb.array([this.fb.control('')]),
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
    console.log('Datos guardados con éxito:', this.cuentaForm.getRawValue());
    this.router.navigate(['/configuracion']);
  }

  cancelar() {
    this.router.navigate(['/configuracion']);
  }
}
