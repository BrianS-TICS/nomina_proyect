import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-nomina',
  templateUrl: './nomina.component.html',
  styleUrls: ['./nomina.component.scss']
})
export class NominaComponent implements OnInit {

  formulario: FormGroup;

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.formulario = this.fb.group({
      folio: ['', Validators.required],
      rfc: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)]
    });
  }

  guardar() {
    if (this.formulario.valid) {
      const empleado = {
        folio: this.formulario.get('folio').value,
        rfc: this.formulario.get('rfc').value,
        correo: this.formulario.get('correo').value,
        telefono: this.formulario.get('telefono').value
      };
      this.modal.close(empleado);
    }
  }

}
