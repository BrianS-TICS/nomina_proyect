import { Component } from '@angular/core';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import * as csvToJson from 'csvtojson';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmpleadoComponent } from './dialog/empleado/empleado.component';
import { IncapacidadesComponent } from './dialog/incapacidades/incapacidades.component';
import { NominaComponent } from './dialog/nomina/nomina.component';
import { PuestoComponent } from './dialog/puesto/puesto.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'csvpayment';
  fileCharged: File;

  private CSVData: any;

  public puestos = [];
  public empleados = [];
  public incapacidades = [];
  public nominas = [];



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

  public percepciones = [
    { valor: "1", nombre: "Sueldo base" },
    { valor: "2", nombre: "Puntualidad" },
    { valor: "3", nombre: "Vales de despensa" },
    { valor: "4", nombre: "Compensaciones" },
    { valor: "5", nombre: "Vacaciones" },
  ]

  public deducciones = [
    { valor: "1", nombre: "ISR" },
    { valor: "2", nombre: "IMSS" },
    { valor: "3", nombre: "INFONAVID" },
    { valor: "4", nombre: "Caja de ahorro" },
  ]


  public CURRENTPAGE = 1;

  constructor(private modalService: NgbModal) {
    this.fileCharged = null
    this.CSVData = null

    this.getLocalStorageData();
  }

  public onFileSelected(event: any) {
    this.fileCharged = event.target.files[0];

    const reader = new FileReader();
    reader.readAsText(this.fileCharged);

    reader.onload = () => {

      const csvData = reader.result as string;
      csvToJson().fromString(csvData).then((CSVData) => {
        this.CSVData = CSVData
      });

    };
  }


  public findRfcEmpleado(id: string) {
    const empleado = this.empleados.find(elemento => elemento.id == id);
    return empleado.rfc
  }


  public findEmpleado(id: string) {
    const empleado = this.empleados.find(elemento => elemento.id == id);
    return empleado
  }

  public findPuesto(id: string) {
    const puesto = this.puestos.find(elemento => elemento.id == id);
    return puesto.nombre
  }

  public findAllPuestoData(id: string) {
    const puesto = this.puestos.find(elemento => elemento.id == id);
    return puesto
  }

  public findTipoContrato(id: string) {
    const tipoContrato = this.tipos_contratos.find(elemento => elemento.valor == id);
    return tipoContrato.nombre
  }

  public findMetodoPago(id: string) {
    const tipoContrato = this.metodos_pago.find(elemento => elemento.valor == id);
    return tipoContrato.nombre
  }



  public getLocalStorageData() {

    const puestosStr = localStorage['puestos'];
    if (puestosStr) {
      this.puestos = JSON.parse(puestosStr);
    }

    const incapacidadesStr = localStorage['incapacidades'];
    if (incapacidadesStr) {
      this.incapacidades = JSON.parse(incapacidadesStr);
    }

    const empleadosStr = localStorage['empleados'];
    if (empleadosStr) {
      this.empleados = JSON.parse(empleadosStr);
    }

    const nominasStr = localStorage['nominas'];
    if (nominasStr) {
      this.nominas = JSON.parse(nominasStr);
    }
  }

  public imprimirNomina(objeto: any) {

    const dd = {
      content: [
        { text: 'Recibo de pago', style: 'header' },
        { text: `Folio: ${objeto.folio}`, style: 'datos' },
        { text: `Periodo: ${objeto.fecha_fin} a ${objeto.fecha_fin}`, style: 'datos' },
        { text: 'Datos del empleado', style: 'subheader' },
        { text: `Nombre: ${objeto.nombre}`, style: 'datos' },
        { text: `RFC: ${objeto.rfc}`, style: 'datos' },
        { text: `NSS: ${objeto.nss}`, style: 'datos' },
        { text: `Puesto: ${objeto.puesto}`, style: 'datos' },
        { text: `Salario diario: ${objeto.salario_diario}`, style: 'datos' },
        { text: `Dias pagados: ${objeto.dias_pagados}`, style: 'datos' },
        { text: `Método de pago: ${objeto.metodo_pago}`, style: 'datos' },
        { text: 'Percepciones', style: 'subheader' },
        this.generarTabla(objeto.percepciones),
        { text: `Total percepciones: ${objeto.total_percepciones}`, style: 'datos' },
        { text: 'Deducciones', style: 'subheader' },
        this.generarTabla(objeto.deducciones),
        { text: `Total deducciones: ${objeto.total_deducciones}`, style: 'datos' },
        { text: `Subtotal: ${objeto.subtotal}`, style: 'datos' },
        { text: `Total a pagar: ${objeto.total}`, style: 'datos' }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: 0,
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: 1,
        },
        datos: {
          fontSize: 12,
          margin: 1,
        },
        tabla: {
          margin: 15
        }
      }
    };

    pdfMake.createPdf(dd).open();
  }

  generarTabla(data) {
    const tabla = {
      table: {
        widths: ['*', '*', '*'],
        body: [
          ['Numero', 'Nombre', 'Cantidad']
        ]
      },
      layout: {
        hLineWidth: function (i, node) {
          return (i === 0 || i === node.table.body.length) ? 0 : 1;
        },
        vLineWidth: function (i, node) {
          return 0;
        },
        hLineColor: function (i, node) {
          return '#aaa';
        },
        paddingLeft: function (i, node) {
          return i === 0 ? 0 : 8;
        },
        paddingRight: function (i, node) {
          return i === node.table.widths.length - 1 ? 0 : 8;
        },
        paddingTop: function (i, node) {
          return 5;
        },
        paddingBottom: function (i, node) {
          return 5;
        }
      }
    };

    data.forEach(item => {
      tabla.table.body.push([item.valor, item.nombre, item.cantidad]);
    });

    return tabla;
  }

  public openEmpleadoDialog() {
    const modalRef = this.modalService.open(EmpleadoComponent, { size: 'lg' });
    modalRef.componentInstance.variable = 'valor';
  }

  public openIncapacidadesDialog() {
    const modalRef = this.modalService.open(IncapacidadesComponent, { size: 'lg' });
  }

  public openNominaDialog() {
    const modalRef = this.modalService.open(NominaComponent, { size: 'lg' });
  }

  public openPuestoDialog() {
    const modalRef = this.modalService.open(PuestoComponent);
  }




  public makePdf() {

    const puesto = this.findAllPuestoData(this.CSVData[0].id_puesto)
    const empleado = this.findEmpleado(this.CSVData[0].id_empleado)
    console.log(this.CSVData);
    console.log(puesto);
    console.log(empleado);

    const salarioDiario = (empleado.salario_diario / 30).toFixed(2)

    const subtotalCalculo = Math.ceil(parseFloat(this.CSVData.dias_trabajados || '0') * parseFloat(salarioDiario));

    const salario_diario = parseFloat(salarioDiario)
    const ISR = subtotalCalculo * .11
    const IMSS = subtotalCalculo * .023
    const INFONAVID = subtotalCalculo * .02
    const CajaAhorro = subtotalCalculo * .02

    const incapacidadesDeEmpleado = this.incapacidades.filter(item => item.id_empleado == this.CSVData.id_empleado);

    let deduccionPorIncapacidad = 0

    if (incapacidadesDeEmpleado.length) {
      const incapacidad_inicio = incapacidadesDeEmpleado[0].fecha_inicio
      const incapacidad_fin = incapacidadesDeEmpleado[0].fecha_fin
      const periodo_inicio = this.CSVData.fecha_inicio
      const periodo_fin = this.CSVData.fecha_fin

        // CALCULO DE DIAS
      const fechaInicioPeriodo = moment(periodo_inicio);
      const fechaFinPeriodo = moment(periodo_fin);

      const fechaInicioIncapacidad = moment(incapacidad_inicio);
      const fechaFinIncapacidad = moment(incapacidad_fin);

        // Encontrar la fecha de inicio común entre los dos periodos
      const fechaInicioComun = moment.max(fechaInicioPeriodo, fechaInicioIncapacidad);

        // Encontrar la fecha de fin común entre los dos periodos
      const fechaFinComun = moment.min(fechaFinPeriodo, fechaFinIncapacidad);

        // Calcular la diferencia en días entre las fechas comunes
      const diasIncapacidadDentroPeriodo = fechaFinComun.diff(fechaInicioComun, 'days') + 1;

      deduccionPorIncapacidad = diasIncapacidadDentroPeriodo * salario_diario;
    }


    const totalDeducciones = (ISR + CajaAhorro + IMSS + INFONAVID + deduccionPorIncapacidad ? deduccionPorIncapacidad : 0).toFixed(2)

    const deducciones = [
      { valor: "1", nombre: "ISR", cantidad: ISR },
      { valor: "2", nombre: "IMSS", cantidad: IMSS },
      { valor: "3", nombre: "INFONAVID", cantidad: INFONAVID },
      { valor: "4", nombre: "Caja de ahorro", cantidad: CajaAhorro },
      deduccionPorIncapacidad ? { valor: "5", nombre: "Incapacidad", cantidad: deduccionPorIncapacidad } : null
    ]

    const puntualidad = 300
    const vales = 200
    const compensasiones = subtotalCalculo * .02
    const vacaciones = subtotalCalculo * .01
    const sueldoBase = subtotalCalculo
    const totalPersepciones = (sueldoBase + vacaciones + vacaciones + compensasiones + vales + puntualidad).toFixed(2)


    const percepciones = [
      { valor: "1", nombre: "Sueldo base", cantidad: subtotalCalculo },
      { valor: "2", nombre: "Puntualidad", cantidad: puntualidad },
      { valor: "3", nombre: "Vales de despensa", cantidad: vales },
      { valor: "4", nombre: "Compensaciones", cantidad: compensasiones },
      { valor: "5", nombre: "Vacaciones", cantidad: vacaciones },
    ]

    const total = (parseFloat(totalPersepciones) - parseFloat(totalDeducciones)).toFixed(2)

    
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

  }


}
