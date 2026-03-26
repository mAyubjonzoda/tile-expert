import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormArray } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-modal-search',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-search.component.html',
  styleUrl: './modal-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalSearchComponent {
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  searchHistoryItems = [
    'закрепить теги',
    'кнопка',
    'приложение',
    'форма',
    'текстовое поле',
    'выпадающий список',
  ];

  filterOptions = ['Я участник', 'Строгий поиск', 'В заголовках'];
  searchScopes = ['Теги', 'Просьбы', 'Контакты'];

  form = this.fb.nonNullable.group({
    author: '',
    filters: this.fb.array(this.filterOptions.map(() => false)),
    scopes: this.fb.array(this.searchScopes.map(() => false)),
  });

  get filtersArray() {
    return this.form.controls.filters as FormArray;
  }

  get scopesArray() {
    return this.form.controls.scopes as FormArray;
  }

  constructor() {
    this.form.valueChanges
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        console.log(value);
      });
  }

  selectMe() {
    this.form.patchValue({
      author: 'Muhammad Ayubjonzoda',
    });
  }
}
