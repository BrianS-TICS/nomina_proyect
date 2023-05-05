import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbPaginationModule, NgbAlertModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';


import { AppComponent } from './app.component';
import { EmpleadoComponent } from './dialog/empleado/empleado.component';
import { IncapacidadesComponent } from './dialog/incapacidades/incapacidades.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NominaComponent } from './dialog/nomina/nomina.component';
import { PuestoComponent } from './dialog/puesto/puesto.component';

@NgModule({
  declarations: [
    AppComponent,
    EmpleadoComponent,
    IncapacidadesComponent,
    NominaComponent,
    PuestoComponent,
  ],
  imports: [
    BrowserModule,
    NgbDatepickerModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
