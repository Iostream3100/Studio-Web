import { Component, Input, OnInit } from "@angular/core";
import { B64Service } from "../b64.service";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-demo",
  templateUrl: "./demo.component.html",
  styleUrls: ["./demo.component.sass"],
})
export class DemoComponent implements OnInit {
  @Input() b64Inputs: string[];

  slots: any = {
    title: "Title",
    subtitle: "Subtitle",
    pageTitle: "ReadAlong Studio",
  };

  constructor(public titleService: Title, public b64Service: B64Service) {
    titleService.setTitle(this.slots.pageTitle);
  }

  onPageTitleChange(e: Event): void {
    const titleValue: string = (<HTMLTextAreaElement>e.target).value;
    this.slots.pageTitle = titleValue;
    this.titleService.setTitle(titleValue);
  }

  ngOnInit(): void {}

  // click botton btn just once
  clicked = false;

  // addTranslationLine is called when the user clicks the "Add Translation" button
  addTranslationLine(): void {
    // @ts-ignore
    const readalongRoot: any = document.querySelector("read-along").shadowRoot;
    const sentences = readalongRoot.querySelectorAll(".sentence");
    sentences.forEach((sentence: any) => {
      const innerbutton = document.createElement("button");
      innerbutton.innerHTML = "Add Translation";
      innerbutton.addEventListener("click", () => {
        sentence.insertAdjacentHTML(
          "beforeend",
          '<br><span class = "translation" contenteditable = True>Translation</span>'
        );
        innerbutton.remove();
        //innerbutton.disabled = true;
      });
      sentence.insertAdjacentElement("afterend", innerbutton);
    });
  }

  //pass all sentences to b64Inputs[1]
  updateTextXML(): void {
    // @ts-ignore
    const readalongRoot: any = document.querySelector("read-along").shadowRoot;
    if (readalongRoot == null) {
      return;
    }
    const translation = readalongRoot.querySelectorAll(".translation");
    console.log("======== sentence: ============", translation[1]);
    var textXML = this.b64Service.b64_to_utf8(
      this.b64Inputs[1].substring(this.b64Inputs[1].indexOf(",") + 1)
    );
    console.log("======== textXML before: ============", textXML);
    const parser = new DOMParser();
    const doc = parser.parseFromString(textXML, "application/xml");
    //if translation class exist, delete it
    if (doc.querySelector(".translation") != null) {
      doc.querySelectorAll(".translation").forEach((node) => {
        node.remove();
      });
    }
    const ss = doc.querySelectorAll("s");
    console.log("======== ss: ============", ss[0]);
    console.log("======== ss length: ============", ss.length);
    for (let i = 0; i < ss.length; i++) {
      ss[i].insertAdjacentHTML(
        "afterend",
        `<span class="translation" contenteditable="true">${translation[i].innerHTML}</span>`
      );
    }

    const serializer = new XMLSerializer();
    const xmlStr = serializer.serializeToString(doc);
    console.log("======= textXML after: =============", xmlStr);
    this.b64Inputs[1] =
      this.b64Inputs[1].slice(0, this.b64Inputs[1].indexOf(",") + 1) +
      this.b64Service.utf8_to_b64(xmlStr);
  }

  download() {
    // recall updatetextXML()
    this.updateTextXML();

    console.log(this.slots);
    var element = document.createElement("a");
    let blob = new Blob(
      [
        `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0">
      <title>${this.slots.pageTitle}</title>
      <link rel="stylesheet" href="${this.b64Inputs[3][1]}">
      <script src="${this.b64Inputs[3][0]}"></script>
    </head>
    <body>
        <read-along text="${this.b64Inputs[1]}" alignment="${this.b64Inputs[2]}" audio="${this.b64Inputs[0]}" use-assets-folder="false">
        <span slot="read-along-header">${this.slots.title}</span>
        <span slot="read-along-subheader">${this.slots.subtitle}</span>
        </read-along>
    </body>
    </html>`,
      ],
      { type: "text/html;charset=utf-8" }
    );
    element.href = window.URL.createObjectURL(blob);
    element.download = "readalong.html";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}
