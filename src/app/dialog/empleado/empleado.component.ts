import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { v4 as uuidv4 } from 'uuid';

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


  public tipos_contratos = [
    { valor: "1", nombre: "Contrato temporal" },
    { valor: "2", nombre: "Contrato indefinido" },
    { valor: "3", nombre: "Contrato para la formación y el aprendizaje" },
    { valor: "4", nombre: "Contrato en prácticas" },
  ];

  public metodos_pago = [
    { valor: "1", nombre: "Efectivo" },
    { valor: "2", nombre: "Cheques" },
    { valor: "3", nombre: "Tarjetas de débito" },
    { valor: "4", nombre: "Tarjetas de crédito" },
    { valor: "5", nombre: "Transferencias bancarias electrónicas" },
  ]

  ngOnInit() {

    this.getLocalStorageData()

    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      clave: ['', Validators.required],
      salario_diario: ['', Validators.required],
      tipo_contrato: ['', Validators.required],
      fecha_inicio: ['', Validators.required],
      metodo_pago: ['', Validators.required],
      rfc: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      puesto: ['', Validators.required],
      nss: ['', Validators.required]
    });

    this.formulario.get('puesto').valueChanges.subscribe(puesto => {

      const puestoSeleccionado = this.getPuesto(puesto)


      this.formulario.patchValue({
        salario_diario: ( puestoSeleccionado.salario / 30).toFixed(2)
      });

    });


  }

  public getPuesto(id: string) : any {
    const puesto =  this.puestos.find(element => element.id == id)
    return puesto;
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
        id: uuidv4(),
        nombre: this.formulario.get('nombre').value,
        clave: this.formulario.get('clave').value,
        salario_diario: this.formulario.get('salario_diario').value,
        tipo_contrato: this.formulario.get('tipo_contrato').value,
        fecha_inicio: this.formulario.get('fecha_inicio').value,
        metodo_pago: this.formulario.get('metodo_pago').value,
        rfc: this.formulario.get('rfc').value,
        correo: this.formulario.get('correo').value,
        puesto: this.formulario.get('puesto').value,
        nss: this.formulario.get('nss').value
      };

      let empleados = []
      const empleadosStr = localStorage['empleados'];

      if (empleadosStr) {
        empleados = JSON.parse(empleadosStr);
        empleados.push(empleado)
      } else {
        empleados.push(empleado)
      }

      this.getLocalStorageData()

      localStorage.setItem('empleados', JSON.stringify(empleados));

      this.modal.close(empleado);
    }
  }

}
