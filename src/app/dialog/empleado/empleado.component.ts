import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.scss']
})
export class EmpleadoComponent {


  formulario: FormGroup;
  public puestos = [];

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal
  ) { }

  
  ngOnInit() {
    
    this.getLocalStorageData()

    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      clave: ['', Validators.required],
      salario_diario: ['', Validators.required],
      tipo_contrato: ['', Validators.required],
      fecha_inicio: ['', Validators.required],
      medoto_pago: ['', Validators.required],
      rfc: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      puesto: [1, Validators.required]
    });
  }

  public getLocalStorageData() {

    const puestosStr = localStorage['puestos'];
    if (puestosStr) {
      this.puestos = JSON.parse(puestosStr);
    } 
  }


  guardar() {
    if (this.formulario.valid) {
      const empleado = {
        nombre: this.formulario.get('nombre').value,
        clave: this.formulario.get('clave').value,
        salario_diario: this.formulario.get('salario_diario').value,
        tipo_contrato: this.formulario.get('tipo_contrato').value,
        fecha_inicio: this.formulario.get('fecha_inicio').value,
        medoto_pago: this.formulario.get('medoto_pago').value,
        rfc: this.formulario.get('rfc').value,
        correo: this.formulario.get('correo').value,
        puesto: this.formulario.get('puesto').value,
      };

      console.log(empleado);
      this.modal.close(empleado);
    }
  }

}
