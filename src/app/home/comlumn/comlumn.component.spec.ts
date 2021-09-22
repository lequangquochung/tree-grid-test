import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComlumnComponent } from './comlumn.component';

describe('ComlumnComponent', () => {
  let component: ComlumnComponent;
  let fixture: ComponentFixture<ComlumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComlumnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComlumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
