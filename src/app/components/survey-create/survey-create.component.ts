import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { SurveyService } from '../../services/survey.service';
import { MessageService } from 'primeng/api';
import { atLeastOneQuestionValidator, atLeastTwoOptionsValidator } from '../../validators/create-survey.validator';
import { ErrorMessageComponent } from "../error-message/error-message.component";
import { questionTypeOptions } from '../../enums/question-type.enum';
import { CreateSurveyDto } from '../../dtos/request/create-survey.dto';
import { CreateSurveyResponseDto } from '../../dtos/response/create-survey-response.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-survey-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    ErrorMessageComponent
  ],
  templateUrl: './survey-create.component.html',
  styleUrl: './survey-create.component.css',
})
export class CreateSurveyComponent implements OnInit {
  surveyForm!: FormGroup;
  questionTypes = questionTypeOptions;
  formBuilder = inject(FormBuilder);
  surveyService = inject(SurveyService);
  messageService = inject(MessageService);
  router = inject(Router);

  ngOnInit(): void {
    this.surveyForm = this.formBuilder.group({
      title: ['', Validators.required],
      questions: this.formBuilder.array([]),
    }, {
      validators: [
        atLeastOneQuestionValidator,
        atLeastTwoOptionsValidator
      ]
    });
  }

  get questions(): FormArray {
    return this.surveyForm.get('questions') as FormArray;
  }

  addQuestion(): void {
    this.questions.push(
      this.formBuilder.group({
        text: ['', Validators.required],
        type: ['', Validators.required],
        options: this.formBuilder.array([]),
      })
    );
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  getOptionsControls(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('options') as FormArray;
  }

  addOption(questionIndex: number): void {
    const options = this.getOptionsControls(questionIndex);
    options.push(this.formBuilder.control('', Validators.required));
  }

  removeOption(questionIndex: number, optionIndex: number): void {
    const options = this.getOptionsControls(questionIndex);
    options.removeAt(optionIndex);
  }

  onSubmit(): void {
    this.surveyForm.markAllAsTouched();

    if (this.surveyForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario inválido',
        detail: 'Por favor revisa los campos requeridos de la encuesta',
      });
      return;
    }

    const payload: CreateSurveyDto = this.surveyForm.value;

    this.surveyService.create(payload).subscribe({
      next: (res: CreateSurveyResponseDto) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Encuesta creada',
          detail: 'La encuesta se guardó correctamente',
        });

        this.surveyForm.reset();
        this.questions.clear();

        this.router.navigate([
          '/survey/success',
          res.id,
          res.participationId,
          res.visualizationId
        ]);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo guardar la encuesta',
        });
        console.error('Error al crear encuesta:', err);
      },
    });
  }
}
