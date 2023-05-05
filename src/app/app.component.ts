import { Component } from '@angular/core';
import { jsPDF } from "jspdf";
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

  public getLocalStorageData() {

    const puestosStr = localStorage['puestos'];
    if (puestosStr) {
      this.puestos = JSON.parse(puestosStr);
    } 
  }

  public openEmpleadoDialog() {
    const modalRef = this.modalService.open(EmpleadoComponent);
    modalRef.componentInstance.variable = 'valor';
  }

  public openIncapacidadesDialog() {
    const modalRef = this.modalService.open(IncapacidadesComponent);
  }

  public openNominaDialog() {
    const modalRef = this.modalService.open(NominaComponent);
  }

  public openPuestoDialog() {
    const modalRef = this.modalService.open(PuestoComponent);
  }




  public makePdf() {

    const doc = new jsPDF();
    // Json to String
    const jsonData = JSON.stringify(this.jsonData, null, 4);

    // const headers = [['Nombre', 'Apellido', 'Dirección', 'Ciudad', 'Estado', 'Código Postal']];
    // const rows = [];

    // this.jsonData.forEach((dato) => {
    //   const nombre = dato['John'];
    //   const apellido = dato['Doe'];
    //   const direccion = dato['120 jefferson st.'];
    //   const ciudad = dato['Riverside'];
    //   const estado = dato['NJ'];
    //   const codigoPostal = dato['08075'];

    //   const row = [nombre, apellido, direccion, ciudad, estado, codigoPostal];
    //   rows.push(row);
    // });

    doc.text(jsonData, 0, 20);


    doc.text('Nomina', 10, 10);
    doc.save('Nomina.pdf');

  }


}
