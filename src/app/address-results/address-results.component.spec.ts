import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressResultsComponent } from './address-results.component';

describe('AddressResultsComponent', () => {
  let component: AddressResultsComponent;
  let fixture: ComponentFixture<AddressResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
