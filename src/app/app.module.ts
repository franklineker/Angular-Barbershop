import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from './components/templates/header/header.component';
import { MainComponent } from './components/templates/main/main.component';
import { FooterComponent } from './components/templates/footer/footer.component';
import { AgendaComponent } from './components/views/agenda/agenda.component';
import { HomeComponent } from './components/views/home/home.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BarbersComponent } from './components/views/barbers/barbers.component';
import { OrdersComponent } from './components/views/orders/orders.component';
import { AppointmentsComponent } from './components/views/appointments/appointments.component';
import { ClientsComponent } from './components/views/clients/clients.component';
import { ContactComponent } from './components/views/contact/contact.component';
import { AddressComponent } from './components/views/address/address.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ObserversModule } from '@angular/cdk/observers';
import { FormsModule } from '@angular/forms';
import { ReportsComponent } from './components/views/reports/reports.component';
import { ChairsComponent } from './components/views/chairs/chairs.component';
import { AgmCoreModule } from '@agm/core';
import { MatDialogModule } from '@angular/material/dialog';
import { DeleteDialogComponent } from './components/templates/delete-dialog/delete-dialog.component';
import { ProfileComponent } from './components/views/profile/profile.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AuthorizedComponent } from './components/authorized/authorized.component';
import { LogoutComponent } from './components/views/logout/logout.component';
import { RegisterComponent } from './components/views/register/register.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        MainComponent,
        FooterComponent,
        AgendaComponent,
        HomeComponent,
        BarbersComponent,
        OrdersComponent,
        AppointmentsComponent,
        ClientsComponent,
        ContactComponent,
        AddressComponent,
        ReportsComponent,
        ChairsComponent,
        DeleteDialogComponent,
        ProfileComponent,
        AuthorizedComponent,
        LogoutComponent,
        RegisterComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        AppRoutingModule,
        MatIconModule,
        MatMenuModule,
        MatDatepickerModule,
        MatCardModule,
        MatFormFieldModule,
        MatNativeDateModule,
        MatInputModule,
        HttpClientModule,
        ObserversModule,
        MatSelectModule,
        FormsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDWkpBmAQ7XRpusU2YdxjKNxFL0n97ppq0',
        }),
        OAuthModule.forRoot(),
        MatDialogModule,
    ],
    providers: [
        OrdersComponent,
        MainComponent,
        AgendaComponent,
        DeleteDialogComponent,
        ProfileComponent,
        HeaderComponent,
        { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
