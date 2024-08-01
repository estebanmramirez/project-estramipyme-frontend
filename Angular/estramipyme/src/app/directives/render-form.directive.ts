import {Directive, inject, ElementRef, signal, Input} from '@angular/core';
import {DataProcService} from "@services/data-proc.service";
import {Question} from "@models/question.model";

@Directive({
  selector: '[appRenderForm]',
  standalone: true
})
export class RenderFormDirective {
  element = inject(ElementRef)
  questions = signal<Question[]>([])
  @Input({required: true}) url!: string;

  private dataProc = inject(DataProcService)

  ngOnInit() {
    //const url = "http://localhost:3000/questions"
    this.dataProc.getItems(this.url).subscribe({
      next: questions => {
        this.questions.set(questions)

        //const clientData = questions.filter((e: Question) => e.section === "cliente");
        this._createForm(questions, 1)
      },
      error: err => {
        console.log(err)
      }
    })

  }

  _createForm(data: Question[], id: String | number) {
    // console.log(data)
    const form = this._createFormElement(data, id);
    const formContainer = this.element.nativeElement as HTMLElement;
    formContainer.append(form);
    return form;
  }

  _createFormElement(data: Question[], id: String | number) {
    const formElement = document.createElement("form");
    formElement.classList.add(`form--${id}`);
    data.forEach((q: Question) => {
      const fieldset = document.createElement("fieldset");
      fieldset.classList.add("questions");
      fieldset.classList.add(`question--${q.id}`);
      fieldset.setAttribute("data-question-id", String(q.id));
      const legend = document.createElement("legend");
      legend.textContent = q.question;

      fieldset.append(legend);
      formElement.append(fieldset);
      q.options.forEach((op: String, index: any) => {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.setAttribute("type", "radio");
        input.setAttribute("name", `$Q${q.id}`);
        input.setAttribute("value", index);
        // label.append(input)
        label.innerHTML = `
      <input type="radio" name="Q${q.id}" value=${
          index + 1
        } class="radioinput radioinput__section--${id}" data-id="${q.id}-${
          index + 1
        }">${op}
      `;
        // label.insertAdjacentHTML('afterend', op);

        fieldset.append(label);
      });
    });
    return formElement;
  };
}
