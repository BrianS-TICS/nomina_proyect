import { Component } from '@angular/core';
import { jsPDF } from "jspdf";
import * as csvToJson from 'csvtojson';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'csvpayment';
  fileCharged: File;
  private jsonData: any;


  constructor() {
    this.fileCharged = null
    this.jsonData = null
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
