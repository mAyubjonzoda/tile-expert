import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  ElementRef,
  DestroyRef,
  viewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SvgIconComponent } from '../../ui/svg-icon/svg-icon.component';
import { ModalSearchComponent } from '../../ui/modal-search/modal-search.component';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  imports: [
    SvgIconComponent,
    ModalSearchComponent,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  readonly searchControl = new FormControl('', { nonNullable: true });

  isSearchInputVisible = signal<boolean>(false);
  isSearchModalVisible = signal<boolean>(false);

  readonly navItems = [
    { icon: 'link', text: 'Ссылки', url: '#' },
    { icon: 'contact', text: 'Контакты', url: '#' },
    { icon: 'tag', text: 'Теги', url: '#' },
    { icon: 'star', text: 'Избранное', url: '#' },
    { icon: 'history', text: 'Посещения', url: '#' },
  ];

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => {
        console.log(value);
      });
  }

  ngOnInit() {
    fromEvent<MouseEvent>(document, 'click')
      .pipe(
        filter((event) => {
          const target = event.target as HTMLElement;
          return !target.closest('.click');
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.hideSearchInput();
      });
  }

  showSearchInput() {
    this.isSearchInputVisible.set(true);
    if (window.innerWidth <= 768) {
      setTimeout(() => {
        this.searchInput()?.nativeElement?.focus();
      }, 100);
    }
  }

  showSearchModal() {
    this.isSearchModalVisible.set(true);
  }

  hideSearchInput() {
    this.isSearchInputVisible.set(false);
    this.isSearchModalVisible.set(false);
  }
}
