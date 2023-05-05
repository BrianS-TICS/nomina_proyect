import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { v4 as uuidv4 } from 'uuid';


@Component({
  selector: 'app-puesto',
  templateUrl: './puesto.component.html',
  styleUrls: ['./puesto.component.scss']
})
export class PuestoComponent implements OnInit {


  formulario: FormGroup;

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      salario: ['', [Validators.required]],
    });
  }

  guardar() {
    if (this.formulario.valid) {
      const puesto = {
        id: uuidv4(), // generar un id único con uuidv4()
        nombre: this.formulario.get('nombre').value,
        descripcion: this.formulario.get('descripcion').value,
        salario: this.formulario.get('salario').value,
      };


      let puestos = []
      const puestosStr = localStorage['puestos'];

      if (puestosStr) {
        puestos = JSON.parse(puestosStr);
        puestos.push(puesto)
      } else {
        puestos.push(puesto)
      }

      localStorage.setItem('puestos', JSON.stringify(puestos));

      this.modal.close(puesto);


    }
  }

}
