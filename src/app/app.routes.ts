import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CreateSurveyComponent } from './components/survey-create/survey-create.component';
import { SurveyAnswerComponent } from './components/survey-answer/survey-answer.component';
import { SurveySuccessComponent } from './components/survey-success/survey-success.component';
import { SurveyResultComponent } from './components/survey-result/survey-result.component';
import { SurveyStatisticComponent } from './components/survey-statistic/survey-statistic.component';
import { SurveyListComponent } from './components/survey-list/survey-list.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'survey/create',
    component: CreateSurveyComponent,
  },
  {
    path: 'survey/answer/:id/:participationId',
    component: SurveyAnswerComponent,
  },
  {
    path: 'survey/success/:id/:participationId/:visualizationId',
    component: SurveySuccessComponent,
  },
  {
    path: 'survey/result/:id/:visualizationId',
    component: SurveyResultComponent,
  },
  {
    path: 'survey/statistic/:id/:visualizationId',
    component: SurveyStatisticComponent,
  },
  {
    path: 'surveys',
    component: SurveyListComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
