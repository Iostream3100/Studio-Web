import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
// add By to query
import { By } from "@angular/platform-browser";

import { MaterialModule } from "../material.module";
import { DemoComponent } from "./demo.component";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { HttpClientModule } from "@angular/common/http";
import { HttpClient, HttpEventType } from "@angular/common/http";
import { B64Service } from "../b64.service";
// ==== check create or not and defalut value =====
describe("DemoComponent", () => {
  let component: DemoComponent;
  let fixture: ComponentFixture<DemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MaterialModule],
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

  it("test editable page title when it is simple value", () => {
    const { debugElement } = fixture;
    const formData = fixture.debugElement.query(By.css("#newpagetitle"));
    formData.nativeElement.value = "new";
    formData.nativeElement.dispatchEvent(new Event("input"));

    expect(formData.nativeElement.value).toBe("new");
  });

  it("test empty editable page title", () => {
    const { debugElement } = fixture;
    const formData = fixture.debugElement.query(By.css("#newpagetitle"));
    formData.nativeElement.value = "";
    formData.nativeElement.dispatchEvent(new Event("input"));

    expect(formData.nativeElement.value).toBe("");
  });

  it("test empty editable page title", () => {
    const { debugElement } = fixture;
    const formData = fixture.debugElement.query(By.css("#newpagetitle"));
    formData.nativeElement.value = "111";
    formData.nativeElement.dispatchEvent(new Event("input"));
    formData.nativeElement.value = "222";
    formData.nativeElement.dispatchEvent(new Event("input"));
    expect(formData.nativeElement.value).toBe("222");
  });

  it("test editable page title including special characters", () => {
    let car: string = '!"§$%&/()=?\u{20ac}';
    let res: string = car.substring(Math.floor(car.length * Math.random()), 1);
    const { debugElement } = fixture;
    const formData = fixture.debugElement.query(By.css("#newpagetitle"));
    formData.nativeElement.value = "new";
    formData.nativeElement.dispatchEvent(new Event("input"));
    expect(formData.nativeElement.value).toBe("new");
  });

  it("test editable page title after third edit ", () => {
    const { debugElement } = fixture;
    const formData = fixture.debugElement.query(By.css("#newpagetitle"));
    formData.nativeElement.value = "new editable Page";
    formData.nativeElement.dispatchEvent(new Event("input"));
    formData.nativeElement.value = "new editable Page 2";
    formData.nativeElement.dispatchEvent(new Event("input"));
    formData.nativeElement.value = "new editable Page 3";
    formData.nativeElement.dispatchEvent(new Event("input"));
    expect(formData.nativeElement.value).toBe("new editable Page 3");
  });

  var num: number = Math.ceil(Math.random() * 10);
  var car: string = '!"§$%&/()=?\u{20ac}';
  var res: string = car.substring(Math.floor(car.length * Math.random()), 1);

  it("test editable page title after random times of edit ", () => {
    const { debugElement } = fixture;
    const formData = fixture.debugElement.query(By.css("#newpagetitle"));
    formData.nativeElement.value = num;
    formData.nativeElement.dispatchEvent(new Event("input"));
    expect(formData.nativeElement.value).toBe(num);
  });

  it("test editable page title after random times of space in the front", () => {
    const { debugElement } = fixture;
    const formData = fixture.debugElement.query(By.css("#newpagetitle"));
    formData.nativeElement.value =
      Array(num).fill("\xa0").join("") + "new editable Page";
    formData.nativeElement.dispatchEvent(new Event("input"));
    expect(formData.nativeElement.value).toBe(
      Array(num).fill("\xa0").join("") + "new editable Page"
    );
  });

  it("test editable page title after random times of space in the end", () => {
    const { debugElement } = fixture;
    const formData = fixture.debugElement.query(By.css("#newpagetitle"));
    formData.nativeElement.value =
      "new editable Page" + Array(num).fill("\xa0").join("");
    formData.nativeElement.dispatchEvent(new Event("input"));
    expect(formData.nativeElement.value).toBe(
      "new editable Page" + "\xa0".repeat(num)
    );
  });

  it("test editable page title including special characters", () => {
    const { debugElement } = fixture;
    const formData = fixture.debugElement.query(By.css("#newpagetitle"));
    formData.nativeElement.value = "new editable Page" + res;
    formData.nativeElement.dispatchEvent(new Event("input"));
    expect(formData.nativeElement.value).toBe("new editable Page" + res);
  });

  it("test editable page title including special characters", () => {
    const { debugElement } = fixture;
    const formData = fixture.debugElement.query(By.css("#newpagetitle"));
    formData.nativeElement.value = "new editable Page" + res;
    formData.nativeElement.dispatchEvent(new Event("input"));
    expect(formData.nativeElement.value).toBe("new editable Page" + res);
  });

  it("test editable page title too short", () => {
    let tmp: string = randomRange(1, 3);
    const { debugElement } = fixture;
    const formData = fixture.debugElement.query(By.css("#newpagetitle"));
    formData.nativeElement.value = tmp;
    formData.nativeElement.dispatchEvent(new Event("input"));
    expect(formData.nativeElement.value).toBe(tmp);
  });

  it("test editable page title too long", () => {
    let tmp: string = randomRange(100, 500);
    const { debugElement } = fixture;
    const formData = fixture.debugElement.query(By.css("#newpagetitle"));
    formData.nativeElement.value = tmp;
    formData.nativeElement.dispatchEvent(new Event("input"));
    expect(formData.nativeElement.value).toBe(tmp);
  });
});

function randomRange(min: number, max: number) {
  var returnStr = "";
  var range = max ? Math.round(Math.random() * (max - min)) + min : min,
    arr = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ];

  for (var i = 0; i < range; i++) {
    var index = Math.round(Math.random() * (arr.length - 1));
    returnStr += arr[index];
  }
  return returnStr;
}

// test for milestone3
describe("B64Service", () => {
  let service: B64Service;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(B64Service);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should turn utf8 to b64 and back", () => {
    let testUTF8 = `󳬏ۓ脶򍫐䏷򻱚1󔊣򧰗J鷍ˑ⨘󝳗ʳꟴ󆋔=є򻥼Ӳ򦿴¦槩7}摠꾀𴮣۝م𬷊
    ,^⒆!טФ񤨷Յe󫱷ъ"Ҁ*=ߋ󻅷񌍖_ᾀ\ꡝ񲁿g"՝MU񔡆ЀL
    劆֒񦘰ˑ{坋𹔸lǼc&񓱬񊄸Ӽ:󌈅=̹ɽ渭觙􈯶൰ȣ¡圤𹷟򱄢揋ﺝ􊃻^
    E̶򱩀򑪟eٌϐ򔜮霗燨综*􍪻񭚴oꕃ𷴨2ҽT񺆥uR혙񗊭:򉪼񙏺ۤƓ騡
    񱺡􌡩PȌ񸛍񩍢􅓴冖㌃ۄ𦄜7Ž⇆*zѱ澁nަvۭË́듍JҢ䆹M󩗟繶`;
    expect(service.b64_to_utf8(service.utf8_to_b64(testUTF8))).toEqual(
      testUTF8
    );
  });

  // the situation when there is only one word'test'
  it("should b63service works when with one word of translation", () => {
    let testxml = `PFRFST4KICAgIDx0ZXh0IHhtbDpsYW5nPSJlbmciIGZhbGxiYWNrLWxhbmdzPSJ1
    bmQiIGlkPSJ0MCI+CiAgICAgICAgPGJvZHkgaWQ9InQwYjAiPgogICAgICAgICAgICA8ZGl2IHR5cGU9
    InBhZ2UiIGlkPSJ0MGIwZDAiPgogICAgICAgICAgICAgICAgPHAgaWQ9InQwYjBkMHAwIj4KICAgICAg
    ICAgICAgICAgICAgICA8cyBpZD0idDBiMGQwcDBzMCI+PHcgaWQ9InQwYjBkMHAwczB3MCIgQVJQQUJF
    VD0iVCBFSCBTIFQiPnRlc3Q8L3c+IDx3IGlkPSJ0MGIwZDBwMHMwdzEiIEFSUEFCRVQ9IlQgRUggUyBU
    Ij50ZXN0PC93Pjwvcz48cCBjbGFzcz0idHJhbnNsYXRpb24iPnpoZXNoaW48L3A+CiAgICAgICAgICAg
    ICAgICA8L3A+CiAgICAgICAgICAgIDwvZGl2PgogICAgICAgIDwvYm9keT4KICAgIDwvdGV4dD4KPC9URUk+`;
    let translation = service.b64_to_utf8(testxml);
    expect(service.b64_to_utf8(service.utf8_to_b64(testxml))).toEqual(testxml);
  });

  // the situation when the sentence ocupies half of the line
  it("should b63service works with a medium length translation", () => {
    let testxml = `PFRFST4KICAgIDx0ZXh0IHhtbDpsYW5nPSJlbmciIGZhbGxiYWNrLWxhbmdzPSJ1bmQi
    IGlkPSJ0MCI+CiAgICAgICAgPGJvZHkgaWQ9InQwYjAiPgogICAgICAgICAgICA8ZGl2IHR5cGU9InBhZ2Ui
    IGlkPSJ0MGIwZDAiPgogICAgICAgICAgICAgICAgPHAgaWQ9InQwYjBkMHAwIj4KICAgICAgICAgICAgICAg
    ICAgICA8cyBpZD0idDBiMGQwcDBzMCI+PHcgaWQ9InQwYjBkMHAwczB3MCIgQVJQQUJFVD0iREggSUggUyI+
    dGhpczwvdz4gPHcgaWQ9InQwYjBkMHAwczB3MSIgQVJQQUJFVD0iSUggWiI+aXM8L3c+IDx3IGlkPSJ0MGIw
    ZDBwMHMwdzIiIEFSUEFCRVQ9IkFIIj5hPC93PiA8dyBpZD0idDBiMGQwcDBzMHczIiBBUlBBQkVUPSJUIEVI
    IFMgVCI+dGVzdDwvdz4gPHcgaWQ9InQwYjBkMHAwczB3NCIgQVJQQUJFVD0iRiBBTyBSIj5mb3I8L3c+IDx3
    IGlkPSJ0MGIwZDBwMHMwdzUiIEFSUEFCRVQ9Ik0gQVkgTCBTIFQgT1cgTiI+bWlsZXN0b25lPC93PiA8dyBp
    ZD0idDBiMGQwcDBzMHc2IiBBUlBBQkVUPSJHIFVIIEQiPmdvb2Q8L3c+Ljwvcz48cCBjbGFzcz0idHJhbnNs
    YXRpb24iPui/meaYr+S4gOS4qua1i+ivlTwvcD4KICAgICAgICAgICAgICAgIDwvcD4KICAgICAgICAgICAg
    PC9kaXY+CiAgICAgICAgPC9ib2R5PgogICAgPC90ZXh0Pgo8L1RFST4=`;
    let translation = service.b64_to_utf8(testxml);
    expect(service.b64_to_utf8(service.utf8_to_b64(testxml))).toEqual(testxml);
  });

  // the situation when the sentence ocupies one line
  it("should b63service works with a medium length translation", () => {
    let testxml = `PFRFST4KICAgIDx0ZXh0IHhtbDpsYW5nPSJlbmciIGZhbGxiYWNrLWxhbmdzPSJ1bmQiIGlkPSJ0MCI+Ci
    AgICAgICAgPGJvZHkgaWQ9InQwYjAiPgogICAgICAgICAgICA8ZGl2IHR5cGU9InBhZ2UiIGlkPSJ0MGIwZDAiPgogICAgICAg
    ICAgICAgICAgPHAgaWQ9InQwYjBkMHAwIj4KICAgICAgICAgICAgICAgICAgICA8cyBpZD0idDBiMGQwcDBzMCI+PHcgaWQ9In
    QwYjBkMHAwczB3MCIgQVJQQUJFVD0iREggSUggUyI+dGhpczwvdz4gPHcgaWQ9InQwYjBkMHAwczB3MSIgQVJQQUJFVD0iSUgg
    WiI+aXM8L3c+IDx3IGlkPSJ0MGIwZDBwMHMwdzIiIEFSUEFCRVQ9IlQgRUggUyBUIj50ZXN0PC93PiA8dyBpZD0idDBiMGQwcD
    BzMHczIiBBUlBBQkVUPSJUIEVIIFMgVCI+dGVzdDwvdz4gPHcgaWQ9InQwYjBkMHAwczB3NCIgQVJQQUJFVD0iRiBBTyBSIj5m
    b3I8L3c+IDx3IGlkPSJ0MGIwZDBwMHMwdzUiIEFSUEFCRVQ9IkhIIEFFIFAgSVkiPmhhcHB5PC93PiA8dyBpZD0idDBiMGQwcDB
    zMHc2IiBlZmZlY3RpdmUtZzJwLWxhbmc9InVuZCIgQVJQQUJFVD0iSyBJWSBBQSBPVyBUIE9XIE4gRyI+eGlhb3Rvbmc8L3c+ID
    x3IGlkPSJ0MGIwZDBwMHMwdzciIGVmZmVjdGl2ZS1nMnAtbGFuZz0idW5kIiBBUlBBQkVUPSJZIE9XIE4gRyBLIElZIEFBIE4gR
    yI+eW9uZ3hpYW5nPC93PiA8dyBpZD0idDBiMGQwcDBzMHc4IiBlZmZlY3RpdmUtZzJwLWxhbmc9InVuZCIgQVJQQUJFVD0iRiBFW
    SBOIEcgWSBVVyBOIj5mZW5neXVuPC93PiA8dyBpZD0idDBiMGQwcDBzMHc5IiBlZmZlY3RpdmUtZzJwLWxhbmc9InVuZCIgQVJQQ
    UJFVD0iTSBFWSBOIEcgRCBJWSI+bWVuZ2RpPC93PiA8dyBpZD0idDBiMGQwcDBzMHcxMCIgQVJQQUJFVD0iRUggUiBJSCBLIj5lc
    mljPC93Pjwvcz48cCBjbGFzcz0idHJhbnNsYXRpb24iPui/meaYr+S4gOS4qua1i+ivlea2jOWQkeiSmeiSgm48L3A+CiAgICAgI
    CAgICAgICAgICA8L3A+CiAgICAgICAgICAgIDwvZGl2PgogICAgICAgIDwvYm9keT4KICAgIDwvdGV4dD4KPC9URUk+`;
    let translation = service.b64_to_utf8(testxml);
    expect(service.b64_to_utf8(service.utf8_to_b64(testxml))).toEqual(testxml);
  });

  // the situation when the sentence ocupies more than one line
  it("should b63service works with a medium length translation", () => {
    let testxml = `PFRFST4KICAgIDx0ZXh0IHhtbDpsYW5nPSJlbmciIGZhbGxiYWNrLWxhbmdzPSJ1bmQiIGlkPSJ0MCI+CiAgICAgICAgPGJvZHkgaWQ9InQwY
    jAiPgogICAgICAgICAgICA8ZGl2IHR5cGU9InBhZ2UiIGlkPSJ0MGIwZDAiPgogICAgICAgICAgICAgICAgPHAgaWQ9InQwYjBkMHAwIj4KICAgICAgICAgICAgI
    CAgICAgICA8cyBpZD0idDBiMGQwcDBzMCI+PHcgaWQ9InQwYjBkMHAwczB3MCIgZWZmZWN0aXZlLWcycC1sYW5nPSJ1bmQiIEFSUEFCRVQ9IkNIIEhIIE9XIE4gR
    yBBQSI+Y2hvbmdhPC93PiA8dyBpZD0idDBiMGQwcDBzMHcxIiBlZmZlY3RpdmUtZzJwLWxhbmc9InVuZCIgQVJQQUJFVD0iQ0ggSEggT1cgTiBHIEFBIj5jaG9uZ
    2E8L3c+IDx3IGlkPSJ0MGIwZDBwMHMwdzIiIGVmZmVjdGl2ZS1nMnAtbGFuZz0idW5kIiBBUlBBQkVUPSJDSCBISCBPVyBOIEcgQUEiPmNob25nYTwvdz4gPHcga
    WQ9InQwYjBkMHAwczB3MyIgZWZmZWN0aXZlLWcycC1sYW5nPSJ1bmQiIEFSUEFCRVQ9IkNIIEhIIE9XIE4gRyBBQSI+Y2hvbmdhPC93PiA8dyBpZD0idDBiMGQwc
    DBzMHc0IiBlZmZlY3RpdmUtZzJwLWxhbmc9InVuZCIgQVJQQUJFVD0iQ0ggSEggT1cgTiBHIEFBIj5jaG9uZ2E8L3c+IDx3IGlkPSJ0MGIwZDBwMHMwdzUiIGVmZ
    mVjdGl2ZS1nMnAtbGFuZz0idW5kIiBBUlBBQkVUPSJDSCBISCBPVyBOIEcgQUEiPmNob25nYTwvdz4gPHcgaWQ9InQwYjBkMHAwczB3NiIgZWZmZWN0aXZlLWcyc
    C1sYW5nPSJ1bmQiIEFSUEFCRVQ9IkNIIEhIIE9XIE4gRyBBQSI+Y2hvbmdhPC93PiA8dyBpZD0idDBiMGQwcDBzMHc3IiBlZmZlY3RpdmUtZzJwLWxhbmc9InVuZ
    CIgQVJQQUJFVD0iQ0ggSEggT1cgTiBHIEFBIj5jaG9uZ2E8L3c+IDx3IGlkPSJ0MGIwZDBwMHMwdzgiIGVmZmVjdGl2ZS1nMnAtbGFuZz0idW5kIiBBUlBBQkVUP
    SJDSCBISCBPVyBOIEcgQUEiPmNob25nYTwvdz4gPHcgaWQ9InQwYjBkMHAwczB3OSIgZWZmZWN0aXZlLWcycC1sYW5nPSJ1bmQiIEFSUEFCRVQ9IkNIIEhIIE9XI
    E4gRyBBQSI+Y2hvbmdhPC93PiA8dyBpZD0idDBiMGQwcDBzMHcxMCIgZWZmZWN0aXZlLWcycC1sYW5nPSJ1bmQiIEFSUEFCRVQ9IkNIIEhIIE9XIE4gRyBBQSI+Y
    2hvbmdhPC93PiA8dyBpZD0idDBiMGQwcDBzMHcxMSIgZWZmZWN0aXZlLWcycC1sYW5nPSJ1bmQiIEFSUEFCRVQ9IkNIIEhIIE9XIE4gRyBBQSI+Y2hvbmdhPC93P
    jwvcz48cCBjbGFzcz0idHJhbnNsYXRpb24iPmNob25nYSBjaG9uZ2EgY2hvbmdhIGNob25nYWNob25nYSBjaG9uZ2EgY2hvbmdhIGNob25nYWNob25nYSBjaG9uZ
    2EgY2hvbmdhIGNob25nYWNob25nYSBjaG9uZ2EgY2hvbmdhIGNob25nYWNob25nYSBjaG9uZ2EgY2hvbmdhIGNob25nYWNob25nYSBjaG9uZ2EgY2hvbmdhIGNob
    25nYTwvcD4KICAgICAgICAgICAgICAgIDwvcD4KICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgPC9ib2R5PgogICAgPC90ZXh0Pgo8L1RFST4=`;
    let translation = service.b64_to_utf8(testxml);
    expect(service.b64_to_utf8(service.utf8_to_b64(testxml))).toEqual(testxml);
  });
});
