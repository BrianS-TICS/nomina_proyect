import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-nomina',
  templateUrl: './nomina.component.html',
  styleUrls: ['./nomina.component.scss']
})
export class NominaComponent implements OnInit {

  formulario = new FormGroup({
    nombre: new FormControl('', Validators.required),
    folio: new FormControl('', Validators.required),
    rfc: new FormControl('', Validators.required),
    nss: new FormControl('', Validators.required),
    fecha_inicio: new FormControl('', Validators.required),
    fecha_fin: new FormControl('', Validators.required),
    puesto: new FormControl('', Validators.required),
    metodo_pago: new FormControl('', Validators.required),
    dias_pagados: new FormControl('0', Validators.required),
    salario_diario: new FormControl('0', Validators.required)
  });


  public empleado: any = null
  public sueldoBase: any = '0.00'

  public percepciones = []

  public deducciones = []

  public empleados = [];
  public puestos = [];

  public metodos_pago = [
    { valor: "1", nombre: "Efectivo" },
    { valor: "2", nombre: "Cheques" },
    { valor: "3", nombre: "Tarjetas de débito" },
    { valor: "4", nombre: "Tarjetas de crédito" },
    { valor: "5", nombre: "Transferencias bancarias electrónicas" },
  ]


  public totalPersepciones = '0.00';
  public totalDeducciones = '0.00';

  public total = '0.00';
  public subtotal = '0.00';

  constructor(
    public modal: NgbActiveModal
  ) {
  }

  ngOnInit() {

    this.getLocalStorageData()

    this.formulario.controls.dias_pagados.valueChanges.subscribe(() => {

      const subtotalCalculo = Math.ceil(parseFloat(this.formulario.controls.dias_pagados.value || '0') * parseFloat(this.formulario.controls.salario_diario.value));
      this.subtotal = subtotalCalculo.toFixed(2)

      const ISR = subtotalCalculo * .11
      const IMSS = subtotalCalculo * .023
      const INFONAVID = subtotalCalculo * .02
      const CajaAhorro = subtotalCalculo * .02

      this.totalDeducciones = (ISR + CajaAhorro + IMSS + INFONAVID).toFixed(2)

      this.deducciones = [
        { valor: "1", nombre: "ISR", cantidad: ISR },
        { valor: "2", nombre: "IMSS", cantidad: IMSS },
        { valor: "3", nombre: "INFONAVID", cantidad: INFONAVID },
        { valor: "4", nombre: "Caja de ahorro", cantidad: CajaAhorro },
      ]

      const puntualidad = 300
      const vales = 200
      const compensasiones = subtotalCalculo * .02
      const vacaciones = subtotalCalculo * .01
      const sueldoBase = subtotalCalculo
      this.totalPersepciones = (sueldoBase + vacaciones + vacaciones + compensasiones + vales + puntualidad).toFixed(2)


      this.percepciones = [
        { valor: "1", nombre: "Sueldo base", cantidad: subtotalCalculo },
        { valor: "2", nombre: "Puntualidad", cantidad: puntualidad },
        { valor: "3", nombre: "Vales de despensa", cantidad: vales },
        { valor: "4", nombre: "Compensaciones", cantidad: compensasiones },
        { valor: "5", nombre: "Vacaciones", cantidad: vacaciones },
      ]

      this.total = (parseFloat(this.totalPersepciones) - parseFloat(this.totalDeducciones)).toFixed(2)

    });

  }


  public findPuesto(id: string) {
    const puesto = this.puestos.find(elemento => elemento.id == id);
    return puesto
  }

  public findMetodoPago(id: string) {
    const tipoContrato = this.metodos_pago.find(elemento => elemento.valor == id);
    return tipoContrato.nombre
  }


  public empleadoSeleccionado(e: any) {
    const empleadoId = e.target.value
    const empleado = this.empleados.find(elemento => elemento.id == empleadoId);
    this.empleado = empleado;

    const puesto = this.findPuesto(empleado.puesto);

    const salarioDiarioIntegrado = (puesto.salario / 30).toFixed(2);

    const nombreMetodoPago = this.findMetodoPago(empleado.metodo_pago)

    this.formulario.patchValue({
      nombre: empleado.nombre,
      folio: empleado.folio,
      rfc: empleado.rfc,
      nss: empleado.nss,
      puesto: puesto.nombre,
      salario_diario: salarioDiarioIntegrado,
      metodo_pago: nombreMetodoPago,
    });


  }

  public getLocalStorageData() {

    const puestosStr = localStorage['puestos'];
    if (puestosStr) {
      this.puestos = JSON.parse(puestosStr);
    }

    const empleadosStr = localStorage['empleados'];
    if (empleadosStr) {
      this.empleados = JSON.parse(empleadosStr);
    }
  }

  guardar() {

    if (this.formulario.valid) {

      const fechaActual = new Date();
      const fechaFormateada = fechaActual.toISOString().slice(0, 10);

      const nomina = {
        id: uuidv4(),
        fecha_creacion: fechaFormateada,
        fecha_inicio: this.formulario.get('fecha_inicio').value,
        fecha_fin: this.formulario.get('fecha_fin').value,
        puesto: this.formulario.get('puesto').value,
        metodo_pago: this.formulario.get('metodo_pago').value,
        rfc: this.formulario.get('rfc').value,
        nss: this.formulario.get('nss').value,
        dias_pagados: this.formulario.get('dias_pagados').value,
        salario_diario: this.formulario.get('salario_diario').value,
        total_percepciones: this.totalPersepciones,
        total_deducciones: this.totalDeducciones,
        total: this.total,
        subtotal: this.subtotal,
        percepciones: this.percepciones,
        deducciones: this.deducciones,
        folio: this.formulario.get('folio').value,
        nombre: this.formulario.get('nombre').value
      };

      let nominas = []
      const nominasStr = localStorage['nominas'];

      if (nominasStr) {
        nominas = JSON.parse(nominasStr);
        nominas.push(nomina)
      } else {
        nominas.push(nomina)
      }

      localStorage.setItem('nominas', JSON.stringify(nominas));

      this.modal.close(nomina);
    }
  }

}
