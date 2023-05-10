import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-incapacidades',
  templateUrl: './incapacidades.component.html',
  styleUrls: ['./incapacidades.component.scss']
})
export class IncapacidadesComponent implements OnInit {

  formulario: FormGroup;
  public empleados = [];

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal
  ) { }

  ngOnInit() {

    this.getLocalStorageData()

    this.formulario = this.fb.group({
      folio: ['', Validators.required],
      rfc: ['', Validators.required],
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['', Validators.required],
      dias: ['', Validators.required],
      motivo: ['', Validators.required],
      estatus: ['', Validators.required],
    });
  }

  
  public getLocalStorageData() {

    const empleadosStr = localStorage['empleados'];
    if (empleadosStr) {
      this.empleados = JSON.parse(empleadosStr);
    }
  }

  guardar() {
    if (this.formulario.valid) {
      const incapacidad = {
        id : uuidv4(),
        folio: this.formulario.get('folio').value,
        id_empleado: this.formulario.get('rfc').value,
        fecha_inicio: this.formulario.get('fecha_inicio').value,
        fecha_fin: this.formulario.get('fecha_fin').value,
        dias: this.formulario.get('dias').value,
        motivo: this.formulario.get('motivo').value,
        estatus: this.formulario.get('estatus').value
      };

      let incapacidades = []
      const incapacidadesStr = localStorage['incapacidades'];

      if (incapacidadesStr) {
        incapacidades = JSON.parse(incapacidadesStr);
        incapacidades.push(incapacidad)
      } else {
        incapacidades.push(incapacidad)
      }

      localStorage.setItem('incapacidades', JSON.stringify(incapacidades));

      this.modal.close(incapacidad);
    }
  }



}
