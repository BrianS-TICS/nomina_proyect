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
        { text: `Periodo: ${objeto.fecha_inicio} a ${objeto.fecha_fin}`, style: 'datos' },
        { text: 'Datos del empleado', style: 'subheader' },
        { text: `Nombre: ${objeto.nombre}`, style: 'datos' },
        { text: `RFC: ${objeto.rfc}`, style: 'datos' },
        { text: `NSS: ${objeto.nss}`, style: 'datos' },
        { text: `Puesto: ${objeto.puesto}`, style: 'datos' },
        { text: `Salario diario: ${objeto.salario_diario}`, style: 'datos' },
        { text: `Dias de incapacidad: ${objeto.dias_incapacidad}`, style: 'datos' },
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
    modalRef.closed.subscribe(() => {
      this.getLocalStorageData();
    })
  }

  public openIncapacidadesDialog() {
    const modalRef = this.modalService.open(IncapacidadesComponent, { size: 'lg' });
    modalRef.closed.subscribe(() => {
      this.getLocalStorageData();
    })
  }

  public openNominaDialog() {
    const modalRef = this.modalService.open(NominaComponent, { size: 'lg' });
    modalRef.closed.subscribe(() => {
      this.getLocalStorageData();
    })
  }

  public openPuestoDialog() {
    const modalRef = this.modalService.open(PuestoComponent);
    modalRef.closed.subscribe(() => {
      this.getLocalStorageData();
    })
  }

  public descargarArchivo() {
    // Crea un enlace de descarga
    let enlace = document.createElement('a');
    enlace.href = '/assets/example.csv'; // Reemplaza 'ruta_del_archivo' con la URL del archivo que deseas descargar
    enlace.download = 'example.csv'; // Reemplaza 'nombre_del_archivo' con el nombre que deseas asignarle al archivo descargado

    // Agrega el enlace al documento
    document.body.appendChild(enlace);

    // Simula un clic en el enlace para descargar el archivo
    enlace.click();

    // Remueve el enlace del documento
    document.body.removeChild(enlace);

  }



  public makePdf() {

    const puesto = this.findAllPuestoData(this.CSVData[0].id_puesto)
    const empleado = this.findEmpleado(this.CSVData[0].id_empleado)
    const salarioDiarioStr = (puesto.salario / 30).toFixed(2)

    const moment = require('moment');
    const formatoFecha = 'DD/MM/YYYY';

    const incapacidad_inicio = this.CSVData[0].fecha_inicio
    const incapacidad_fin = this.CSVData[0].fecha_fin

    const periodo_inicio = this.CSVData[0].periodo_inicio
    const periodo_fin = this.CSVData[0].periodo_fin

    // CALCULO DE DIAS
    const fechaInicioPeriodo = moment(periodo_inicio, formatoFecha);
    const fechaFinPeriodo = moment(periodo_fin, formatoFecha);

    const fechaInicioIncapacidad = moment(incapacidad_inicio, formatoFecha);
    const fechaFinIncapacidad = moment(incapacidad_fin, formatoFecha);

    // Encontrar la fecha de inicio común entre los dos periodos
    const fechaInicioComun = moment.max(fechaInicioPeriodo, fechaInicioIncapacidad);

    // Encontrar la fecha de fin común entre los dos periodos
    const fechaFinComun = moment.min(fechaFinPeriodo, fechaFinIncapacidad);

    // Calcular la diferencia en días entre las fechas comunes
    const diasIncapacidadDentroPeriodo = fechaFinComun.diff(fechaInicioComun, 'days') + 1;

    let diasDePeriodo = fechaInicioPeriodo.diff(fechaFinPeriodo, 'days') - 1;
    diasDePeriodo = Math.abs(diasDePeriodo)

    const diasPagados = diasDePeriodo - diasIncapacidadDentroPeriodo;
    console.log(diasDePeriodo)
    const subtotalCalculo = Math.ceil(diasDePeriodo * parseFloat(salarioDiarioStr));

    const salarioDiario = parseFloat(salarioDiarioStr)
    const ISR = subtotalCalculo * .11
    const IMSS = subtotalCalculo * .023
    const INFONAVID = subtotalCalculo * .02
    const CajaAhorro = subtotalCalculo * .02

    const deduccionPorIncapacidad = diasIncapacidadDentroPeriodo * salarioDiario;

    const totalDeducciones = (ISR + CajaAhorro + IMSS + INFONAVID + (deduccionPorIncapacidad ? deduccionPorIncapacidad : 0)).toFixed(2)


    let deducciones;

    if (deduccionPorIncapacidad) {
      deducciones = [
        { valor: "1", nombre: "ISR (11%)", cantidad: ISR },
        { valor: "2", nombre: "IMSS (2.3%)", cantidad: IMSS },
        { valor: "3", nombre: "INFONAVID (2%)", cantidad: INFONAVID },
        { valor: "4", nombre: "Caja de ahorro (2%)", cantidad: CajaAhorro },
        deduccionPorIncapacidad ? { valor: "5", nombre: "Incapacidad", cantidad: deduccionPorIncapacidad } : null
      ]
    } else {
      deducciones = [
        { valor: "1", nombre: "ISR (11%)", cantidad: ISR },
        { valor: "2", nombre: "IMSS (2.3%)", cantidad: IMSS },
        { valor: "3", nombre: "INFONAVID (2%)", cantidad: INFONAVID },
        { valor: "4", nombre: "Caja de ahorro (2%)", cantidad: CajaAhorro },
      ]
    }

    const puntualidad = 300;
    const vales = 200;
    const compensasiones = subtotalCalculo * .02;
    const vacaciones = subtotalCalculo * .01;
    const sueldoBase = subtotalCalculo;

    const totalPersepciones = (sueldoBase + vacaciones + vacaciones + compensasiones + vales + puntualidad).toFixed(2)

    const percepciones = [
      { valor: "1", nombre: "Sueldo base", cantidad: subtotalCalculo },
      { valor: "2", nombre: "Puntualidad (300)", cantidad: puntualidad },
      { valor: "3", nombre: "Vales de despensa (200)", cantidad: vales },
      { valor: "4", nombre: "Compensaciones (2%)", cantidad: compensasiones },
      { valor: "5", nombre: "Vacaciones (1%)", cantidad: vacaciones },
    ]

    const total = (parseFloat(totalPersepciones) - parseFloat(totalDeducciones)).toFixed(2)

    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toISOString().slice(0, 10);

    const nomina = {
      id: uuidv4(),
      fecha_creacion: fechaFormateada,
      fecha_inicio: this.CSVData[0].periodo_inicio,
      fecha_fin: this.CSVData[0].periodo_fin,
      puesto: puesto.nombre,
      dias_incapacidad: diasIncapacidadDentroPeriodo,
      metodo_pago: this.findMetodoPago(empleado.metodo_pago),
      rfc: empleado.rfc,
      nss: empleado.nss,
      dias_pagados: diasPagados,
      salario_diario: salarioDiario,
      total_percepciones: totalPersepciones,
      total_deducciones: totalDeducciones,
      total: total,
      subtotal: subtotalCalculo,
      percepciones: percepciones,
      deducciones: deducciones,
      folio: uuidv4(),
      nombre: empleado.nombre
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
    this.getLocalStorageData();

  }


}
