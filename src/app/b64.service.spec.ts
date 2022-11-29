import { HttpClient, HttpEventType } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { ComponentFixture } from "@angular/core/testing";
import { TestBed } from "@angular/core/testing";
import { B64Service } from "./b64.service";
import { DemoComponent } from "./demo/demo.component";

describe("B64Service", () => {
  let service: B64Service;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let component: DemoComponent;
  let fixture: ComponentFixture<DemoComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DemoComponent],
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(B64Service);

    fixture = TestBed.createComponent(DemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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

  it("test b64Service works", () => {
    let testXML = `PFRFST4KI CAgIDx0ZXh0IHhtbDpsYW5nPSJlbmciIGZhbGxiYWNrLWxhb
                  mdzPSJ1bmQiIGlkPSJ0MCI+CiAgICAgICAgPGJvZHkgaWQ9InQwYjAiPgogICAgICAgICAgICA8Z
                  Gl2IHR5cGU9InBhZ2UiIGlkPSJ0MGIwZDAiPgogICAgICAgICAgICAgICAgPHAgaWQ9InQwYjBkMHAwIj4KICA
                  gICAgICAgICAgICAgICAgICA8cyBpZD0idDBiMGQwcDBzMCI+PHcgaWQ9InQwYjBkMHAwczB3MCIgQVJQQUJFVD0iREg
                  gSUggUyI+VGhpczwvdz4gPHcgaWQ9InQwYjBkMHAwczB3MSIgQVJQQUJFVD0iSUggWiI+aXM8L3c+IDx3IGlkPSJ0MGIwZD
                  BwMHMwdzIiIEFSUEFCRVQ9IkFIIj5hPC93PiA8dyBpZD0idDBiMGQwcDBzMHczIiBBUlBBQkVUPSJUIFVXIEwiPnRvb2w8L3c+IDx
                  3IGlkPSJ0MGIwZDBwMHMwdzQiIEFSUEFCRVQ9IlQgVVciPnRvPC93PiA8dyBpZD0idDBiMGQwcDBzMHc1IiBBUlBBQkVUPSJISCBFSCBM
                  IFAiPmhlbHA8L3c+IDx3IGlkPSJ0MGIwZDBwMHMwdzYiIEFSUEFCRVQ9IlkgVVciPnlvdTwvdz4gPHcgaWQ9InQwYjBkMHAwczB3NyIgQVJ
                  QQUJFVD0iTSBFWSBLIj5tYWtlPC93PiA8dyBpZD0idDBiMGQwcDBzMHc4IiBBUlBBQkVUPSJZIEFPIFIiPnlvdXI8L3c+IDx3IGlkPSJ0MGIwZ
                  DBwMHMwdzkiIEFSUEFCRVQ9Ik9XIE4iPm93bjwvdz4gPHcgaWQ9InQwYjBkMHAwczB3MTAiIEFSUEFCRVQ9IklIIE4gVCBFUiBBRSBLIFQgSUggV
                  iI+aW50ZXJhY3RpdmU8L3c+ICc8dyBpZD0idDBiMGQwcDBzMHcxMSIgZWZmZWN0aXZlLWcycC1sYW5nPSJ1bmQiIEFSUEFCRVQ9IkQgRVkgQUEgRC
                  BBQSBMIE9XIE4gRyI+cmVhZGFsb25nPC93PicgPHcgaWQ9InQwYjBkMHAwczB3MTIiIEFSUEFCRVQ9IkRIIEFFIFQiPnRoYXQ8L3c+IDx3IGlkPSJ0MGIw
                  ZDBwMHMwdzEzIiBBUlBBQkVUPSJISCBBWSBMIEFZIFQgUyI+aGlnaGxpZ2h0czwvdz4gPHcgaWQ9InQwYjBkMHAwczB3MTQiIEFSUEFCRVQ9IlcgRVIgRCBaIj5
                  3b3Jkczwvdz4gPHcgaWQ9InQwYjBkMHAwczB3MTUiIEFSUEFCRVQ9IkFFIFoiPmFzPC93PiA8dyBpZD0idDBiMGQwcDBzMHcxNiIgQVJQQUJFVD0iREggRVkiPnR
                  oZXk8L3c+IDx3IGlkPSJ0MGIwZDBwMHMwdzE3IiBBUlBBQkVUPSJBQSBSIj5hcmU8L3c+IDx3IGlkPSJ0MGIwZDBwMHMwdzE4IiBBUlBBQkVUPSJTIFAgT1cgSyBB
                  SCBOIj5zcG9rZW48L3c+PC9zPgogICAgICAgICAgICAgICAgPC9wPgogICAgICAgICAgICA8L2Rpdj4KICAgICAgICA8L2JvZHk+CiAgICA8L3RleHQ+CjwvVEVJPg==`;
    let transferLine = service.b64_to_utf8(testXML);
    // revoke updateTEXTXML to update the testXML
    console.log(transferLine);
    expect(service.b64_to_utf8(service.utf8_to_b64(testXML))).toEqual(testXML);
  });
});
