import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  OnDestroy,
  Renderer2,
  signal,
  DestroyRef,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SvgIconComponent } from '../../ui/svg-icon/svg-icon.component';
import { ModalSearchComponent } from '../../ui/modal-search/modal-search.component';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
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
export class HeaderComponent implements OnInit, OnDestroy {
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);

  readonly searchControl = new FormControl('', { nonNullable: true });

  readonly navItems = [
    {
      icon: 'link',
      text: 'Ссылки',
      url: '#',
    },
    {
      icon: 'contact',
      text: 'Контакты',
      url: '#',
    },
    {
      icon: 'tag',
      text: 'Теги',
      url: '#',
    },
    {
      icon: 'star',
      text: 'Избранное',
      url: '#',
    },
    {
      icon: 'history',
      text: 'Посещения',
      url: '#',
    },
  ];

  isSearchInputVisible = signal<boolean>(false);
  isSearchModalVisible = signal<boolean>(false);
  private clickListener?: () => void;

  showSearchModal() {
    this.isSearchModalVisible.set(true);
  }

  showSearchInput() {
    this.isSearchInputVisible.set(true);
  }

  hideSearchInput() {
    this.isSearchInputVisible.set(false);
    this.isSearchModalVisible.set(false);
  }

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
    this.clickListener = this.renderer.listen(
      'document',
      'click',
      (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.click')) {
          this.hideSearchInput();
        }
      },
    );
  }

  ngOnDestroy() {
    this.clickListener?.();
  }
}
