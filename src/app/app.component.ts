import { Component } from '@angular/core';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

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

  private jsonData: any;

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
    this.jsonData = null

    this.getLocalStorageData();
  }

  public onFileSelected(event: any) {
    this.fileCharged = event.target.files[0];

    const reader = new FileReader();
    reader.readAsText(this.fileCharged);

    reader.onload = () => {

      const csvData = reader.result as string;
      csvToJson().fromString(csvData).then((jsonData) => {
        this.jsonData = jsonData
        console.log(jsonData)
      });

    };
  }


  public findRfcEmpleado(id: string) {
    const empleado = this.empleados.find(elemento => elemento.id == id);
    return empleado.rfc
  }

  public findPuesto(id: string) {
    const puesto = this.puestos.find(elemento => elemento.id == id);
    return puesto.nombre
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

    console.log(objeto);

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


  }


}
