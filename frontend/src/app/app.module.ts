import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { ServicesComponent } from './services/services.component';
import { FaqComponent } from './faq/faq.component';
import { ContactComponent } from './contact/contact.component';
import { DynamicFormsComponent } from './dynamic-forms/dynamic-forms.component';
import { RehabPlansComponent } from './rehab-plans/rehab-plans.component';
import { ExercisesComponent } from './exercises/exercises.component';
import { PatientProfileComponent } from './patient-profile/patient-profile.component';
import {PhysiotherapistService } from './physiotherapist.service';
import { HttpClientModule } from '@angular/common/http';
import { PatientService } from './patient.service';
import { RehabPlansService } from './rehab-plans.service';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { ExerciseService } from './exercise.service';
import { FormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import { DynamicFormsService } from './dynamic-forms.service';
import { BookAppointmentComponent } from './book-appointment/book-appointment.component';
import { UserAccountsComponent } from './user-accounts/user-accounts.component';
import { UserAccountsService } from './user-accounts.service';
import { DpDatePickerModule } from 'ng2-date-picker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  //MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';

import { EmailService } from './email.service';
import { NewClientComponent } from './new-client/new-client.component';
import { NewClientService } from './new-client.service'
import { ImageService } from './image.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { ClientsOfTherapistComponent } from './clients-of-therapist/clients-of-therapist.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import {MomentModule} from 'angular2-moment/moment.module';
import { PhysioHomeComponent } from './physio-home/physio-home.component';
import { ClientExerciseComponent } from './client-exercise/client-exercise.component';
import { EncryptionService } from './encryption.service';
import { LoginComponent } from './login/login.component';
import { ForgottenPasswordComponent } from './forgotten-password/forgotten-password.component';
import { RecoverAccountComponent } from './recover-account/recover-account.component';
import { BookingsDirective } from './bookings.directive';
import { AppointmentsService } from './appointments.service';
import { NotFoundComponent } from './not-found/not-found.component';
import { AssessmentTestComponent } from './assessment-test/assessment-test.component';
import {AssessmentTestService} from './assessment-test.service';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'angular-calendar';
import {DemoUtilsModule} from '../demo-utils/module';
import { AssignPlanComponent } from './assign-plan/assign-plan.component';
import { CompleteAssessmentTestComponent } from './complete-assessment-test/complete-assessment-test.component';
import { CalendarComponent } from './calendar/calendar.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { WelcomeHomeComponent } from './welcome-home/welcome-home.component';
import { CookieService } from 'ngx-cookie-service';
import { AuthGuard } from './auth.guard'
import { PhysioAuthGuard } from './physio-auth.guard';
import { AdminAuthGuard } from './admin-auth.guard'
import { PaymentService } from './payment.service';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { WrongAccountComponent } from './wrong-account/wrong-account.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ManagePermissionsComponent } from './manage-permissions/manage-permissions.component';
import { RolesService } from './roles.service';
import { SettingsComponent } from './settings/settings.component';
import { GenerateReportComponent } from './generate-report/generate-report.component';
import { ClientHomeComponent } from './client-home/client-home.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { PhysioHomeService } from './physio-home.service';
import { TimeOffComponent } from './time-off/time-off.component';
import { ResourcesComponent } from './resources/resources.component';
import { AuthService } from './interceptors/auth.service'
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    HowItWorksComponent,
    ServicesComponent,
    FaqComponent,
    ContactComponent,
    DynamicFormsComponent,
    RehabPlansComponent,
    ExercisesComponent,
    PatientProfileComponent,
    AdminHomeComponent,
    BookAppointmentComponent,
    UserAccountsComponent,
    NewClientComponent,
    ClientsOfTherapistComponent,
    AppointmentsComponent,
    PhysioHomeComponent,
    ClientExerciseComponent,
    LoginComponent,
    ForgottenPasswordComponent,
    RecoverAccountComponent,
    BookingsDirective,
    NotFoundComponent,
    AssessmentTestComponent,
    AssignPlanComponent,
    CompleteAssessmentTestComponent,
    CalendarComponent,
    WelcomeHomeComponent,
    UnauthorizedComponent,
    WrongAccountComponent,
    WelcomeHomeComponent,
    ManagePermissionsComponent,
    ClientHomeComponent,
    TransactionsComponent,
    SettingsComponent,
    GenerateReportComponent,
    TimeOffComponent,
    ResourcesComponent,
  ],
  imports: [
    MDBBootstrapModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    FormsModule,
    HttpClientModule,
    AngularFontAwesomeModule,
    FileUploadModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    MatStepperModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    NoopAnimationsModule,
    MatGridListModule,
    MomentModule,
    CommonModule,
    CalendarModule.forRoot(),
    DemoUtilsModule,
    MatRadioModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatRadioModule,
    MatButtonToggleModule,
    MatPaginatorModule,
    MatTableModule,
    MatExpansionModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatSliderModule,
    MatTabsModule,
    MatProgressBarModule,
    MatSelectModule,
    DpDatePickerModule
  ],
  providers: [
    PatientService, 
    RehabPlansService, 
    ExerciseService, 
    DynamicFormsService, 
    EmailService, 
    NewClientService, 
    UserAccountsService,
    ImageService, 
    PhysiotherapistService,
    AppointmentsService,
    EncryptionService, 
    AssessmentTestService,
    CookieService,
    AuthGuard,
    PhysioAuthGuard,
    AdminAuthGuard,
    PaymentService,
    RolesService,
    PhysioHomeService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthService, multi: true}],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA ]
})

export class AppModule { }
