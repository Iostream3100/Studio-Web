import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import {By} from '@angular/platform-browser'

import { MaterialModule } from "../material.module";
import { DemoComponent } from "./demo.component";

describe("DemoComponent", () => {
  let component: DemoComponent;
  let fixture: ComponentFixture<DemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialModule],
      declarations: [DemoComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'Title'`, () => {
    expect(component.slots.title).toEqual("Title");
  });

  it(`should have as subtitle 'SubTitle'`, () => {
    expect(component.slots.subtitle).toEqual("Subtitle");
  });

  it(`should have as page title 'ReadAlong Studio'`, () => {
    expect(component.slots.pageTitle).toEqual("ReadAlong Studio");
  });
});


describe("DemoComponent-pagetitle-editrandom-special-characters", () => {
  let component: DemoComponent;
  let fixture: ComponentFixture<DemoComponent>;
  let car: string = '!"§$%&/()=?\u{20ac}';
  let res: string = car.substring(Math.floor(car.length * Math.random()), 1);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialModule],
      declarations: [DemoComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DemoComponent);
    component = fixture.componentInstance;
    component.titleService.setTitle("new Page title");
    fixture.detectChanges();
  });

  it("test editable page title including special characters", () => {
    const { debugElement } = fixture;
    // const title1 = debugElement.query(By.css("#pageTitle")).nativeElement;
    // expect(title1.textContent).toContain("new editable Page" + res);
    // expect(fixture.nativeElement.querySelector('#test1').innerText).toBeNull;
    const formData = fixture.debugElement.query(By.css('#test1'));
    formData.nativeElement.value = "new";
    formData.nativeElement.dispatchEvent(new Event('input'));

    expect(formData.nativeElement.value).toBe("new");


  });

  
});

// ==== test the element is not hidden and defalut value ====
// * ngif visiable
describe("DemoComponent-title-subtitle-defalut", () => {
  let component: DemoComponent;
  let fixture: ComponentFixture<DemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialModule],
      declarations: [DemoComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DemoComponent);
    component = fixture.componentInstance;
  });

  it("test deflaut Title", () => {
     component.b64Inputs = ["true"]
     fixture.detectChanges();
     const { debugElement } = fixture;
     const title1 = debugElement.query(By.css('#divid1')).nativeElement;
     expect(title1.textContent).toBeNull;
  });

  it("test deflaut subTitle", () => {
    component.b64Inputs = ["true"]
    fixture.detectChanges();
    const { debugElement } = fixture;
    const title1 = debugElement.query(By.css('#divid2')).nativeElement;
    expect(title1.textContent).toBeNull;
 });
});

// ==== test the element is not hidden and edit value ====
// * ngif visiable
describe("DemoComponent-title-subtitle-edit", () => {
  let component: DemoComponent;
  let fixture: ComponentFixture<DemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialModule],
      declarations: [DemoComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DemoComponent);
    component = fixture.componentInstance;
    component.b64Inputs = ["true"];
    component.slots.title = "new title";
    fixture.detectChanges();

  });

  it("test edit title", () => {
     const { debugElement } = fixture;
     const title1 = fixture.debugElement.query(By.css('#divid1'));
     title1.nativeElement.value = "new title";
     title1.nativeElement.dispatchEvent(new Event('input'));
     expect(title1.nativeElement.value).toBe("new title");
  });
  
  it("test edit title", () => {
    const { debugElement } = fixture;
    const title1 = fixture.debugElement.query(By.css('#divid2'));
    title1.nativeElement.value = "new sub title";
    title1.nativeElement.dispatchEvent(new Event('input'));
    expect(title1.nativeElement.value).toBe("new sub title");
 });
});

// ==== test the element is not hidden and edit value is empty ====
// * ngif visiable
describe("DemoComponent-title-subtitle-editempty", () => {
  let component: DemoComponent;
  let fixture: ComponentFixture<DemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialModule],
      declarations: [DemoComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DemoComponent);
    component = fixture.componentInstance;
    component.b64Inputs = ["true"];
    // set title is empty
    component.slots.title = "";
    // set sub title is empty
    component.slots.subtitle = "";

    fixture.detectChanges();

  });

  it("test edit title", () => {
    const { debugElement } = fixture;
    const title1 = fixture.debugElement.query(By.css('#divid1'));
    title1.nativeElement.value = "";
    title1.nativeElement.dispatchEvent(new Event('input'));
    expect(title1.nativeElement.value).toBeNull;
 });

  

 it("test edit title", () => {
  const { debugElement } = fixture;
  const title1 = fixture.debugElement.query(By.css('#divid2'));
  title1.nativeElement.value = "";
  title1.nativeElement.dispatchEvent(new Event('input'));
  expect(title1.nativeElement.value).toBeNull;
});


});


// ==== test the element is not hidden and edit value more than once====
// * ngif visiable
describe("DemoComponent-title-subtitle-editmutiplytime", () => {
  let component: DemoComponent;
  let fixture: ComponentFixture<DemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialModule],
      declarations: [DemoComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DemoComponent);
    component = fixture.componentInstance;
    component.b64Inputs = ["true"];

  
    fixture.detectChanges();

  });

  it("test edit title more than once", () => {
    const title1 = fixture.debugElement.query(By.css('#divid1'));
    for(let i = 1; i <=50 ; i++ ){
      title1.nativeElement.value = "title " + i;
    }

    title1.nativeElement.dispatchEvent(new Event('input'));
    expect(title1.nativeElement.value).toBe("title 50");
  });

  it("test edit sub title", () => {
    const title1 = fixture.debugElement.query(By.css('#divid2'));
    for(let i = 1 ; i <=50 ; i++){
      title1.nativeElement.value = "sub title " + i;
    }
  
    title1.nativeElement.dispatchEvent(new Event('input'));
    expect(title1.nativeElement.value).toBe("sub title 50");
 });
});

// === test editable title and sub title including some special characters ====
// * ngif visiable
describe("DemoComponent-title-subtitle-edit", () => {
  let component: DemoComponent;
  let fixture: ComponentFixture<DemoComponent>;
  let car: string = '!"§$%&/()=?\u{20ac}';
  let res: string = car.substring(Math.floor(car.length * Math.random()), 1);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialModule],
      declarations: [DemoComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DemoComponent);
    component = fixture.componentInstance;
    component.b64Inputs = ["true"];
    component.slots.title = "new title";
    fixture.detectChanges();

  });

  it("test edit title", () => {
     const { debugElement } = fixture;
     const title1 = fixture.debugElement.query(By.css('#divid1'));
     title1.nativeElement.value = "new title" + res;
     title1.nativeElement.dispatchEvent(new Event('input'));
     expect(title1.nativeElement.value).toBe("new title" + res);
  });
  
  
  it("test edit title", () => {
    const { debugElement } = fixture;
    const title1 = fixture.debugElement.query(By.css('#divid2'));
    title1.nativeElement.value = "new sub title" + res;
    title1.nativeElement.dispatchEvent(new Event('input'));
    expect(title1.nativeElement.value).toBe("new sub title" + res);】
    
 });
});

