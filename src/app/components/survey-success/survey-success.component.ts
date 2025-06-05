import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { NgxQrcodeStylingComponent } from 'ngx-qrcode-styling';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-survey-success',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    NgxQrcodeStylingComponent,
    DialogModule
  ],
  templateUrl: './survey-success.component.html',
  styleUrl: './survey-success.component.css',
})
export class SurveySuccessComponent implements OnInit {
  surveyId!: number;
  participationId!: string;
  visualizationId!: string;
  answerUrl!: string;
  resultsUrl!: string;
  showQrDialog: boolean = false;

  route = inject(ActivatedRoute);
  messageService = inject(MessageService);

  ngOnInit(): void {
    const baseUrl = window.location.origin;

    this.surveyId = parseInt(this.route.snapshot.paramMap.get('id') ?? '0');
    this.participationId = this.route.snapshot.paramMap.get('participationId') ?? '';
    this.visualizationId = this.route.snapshot.paramMap.get('visualizationId') ?? '';

    this.answerUrl = `${baseUrl}/survey/answer/${this.surveyId}/${this.participationId}`;
    this.resultsUrl = `${baseUrl}/survey/result/${this.surveyId}/${this.visualizationId}`;
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Copiado',
        detail: 'Enlace copiado al portapapeles correctamente',
      });
    }).catch((err) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo copiar el enlace',
      });
      console.error('Error al copiar enlace:', err);
    })
  }
}
