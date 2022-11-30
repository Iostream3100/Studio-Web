import { Component, Input, OnInit } from "@angular/core";
import { B64Service } from "../b64.service";
import { FormBuilder } from "@angular/forms";

@Component({
  selector: "app-demo",
  templateUrl: "./demo.component.html",
  styleUrls: ["./demo.component.sass"],
})
export class DemoComponent implements OnInit {
  @Input() b64Inputs: string[];

  slots: any = { title: "Title", subtitle: "Subtitle" };
  defaultImage = "image-for-page1.jpg";
  whiteImage = "white.png";

  imageUrlForm = this.formBuilder.group({
    pageIndex: 0,
    url: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
  });

  constructor(
    private b64Service: B64Service,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initImageForEachPage();
  }

  updateImage(pageIndex: number, url: string) {
    // @ts-ignore
    const readalongRoot: any = document.querySelector("read-along").shadowRoot;
    const images = readalongRoot.querySelectorAll(".image");
    images[pageIndex].setAttribute("src", url);
  }

  updateImageInTextXML(pageIndex: number, url: string) {
    console.log("base64[1]: ", this.b64Inputs[1]);
    var textXML = this.b64Service.b64_to_utf8(
      this.b64Inputs[1].substring(this.b64Inputs[1].indexOf(",") + 1)
    );

    const parser = new DOMParser();
    const doc = parser.parseFromString(textXML, "application/xml");
    const pages = doc.querySelectorAll("div[type=page]");

    // @ts-ignore
    pages[pageIndex].querySelector("graphic").setAttribute("url", url);
    console.log("page after:", pages[pageIndex]);

    const serializer = new XMLSerializer();
    const xmlStr = serializer.serializeToString(doc);

    console.log("XML after: ", xmlStr);

    this.b64Inputs[1] =
      this.b64Inputs[1].slice(0, this.b64Inputs[1].indexOf(",") + 1) +
      this.b64Service.utf8_to_b64(xmlStr);
  }

  onUploadImage(): void {
    this.updateImage(
      <number>this.imageUrlForm.value.pageIndex,
      <string>this.imageUrlForm.value.url
    );
    this.updateImageInTextXML(
      <number>this.imageUrlForm.value.pageIndex,
      <string>this.imageUrlForm.value.url
    );
  }

  initImageForEachPage(): void {
    var textXML = this.b64Service.b64_to_utf8(
      this.b64Inputs[1].substring(this.b64Inputs[1].indexOf(",") + 1)
    );
    console.log("textXML before:", textXML);

    const parser = new DOMParser();
    const doc = parser.parseFromString(textXML, "application/xml");
    const pages = doc.querySelectorAll("div[type=page]");
    console.log("XML pages: ", pages);
    pages.forEach((page) => {
      page.insertAdjacentHTML("afterbegin", '<graphic url="white.png"/>');
      //page.querySelector(image.parentNode)
    });

    const serializer = new XMLSerializer();
    const xmlStr = serializer.serializeToString(doc);
    console.log("textXML after:", xmlStr);

    this.b64Inputs[1] =
      this.b64Inputs[1].slice(0, this.b64Inputs[1].indexOf(",") + 1) +
      this.b64Service.utf8_to_b64(xmlStr);
  }

  addUploadImageButton(): void {
    // @ts-ignore
    const readalongRoot: any = document.querySelector("read-along").shadowRoot;
    const images = readalongRoot.querySelectorAll(".image");
    const imageContainers = readalongRoot.querySelectorAll(".image__container");

    for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
      const button_local = document.createElement("input");
      button_local.type = "file";

      const button_url = document.createElement("button");
      const button_delete = document.createElement("button");
      button_local.innerHTML = "Button_local";
      button_url.innerHTML = "Enter Image URL";
      button_delete.innerHTML = "Button_delete";

      imageContainers[imageIndex].insertAdjacentElement(
        "afterbegin",
        button_local
      );
      imageContainers[imageIndex].insertAdjacentElement(
        "afterbegin",
        button_url
      );

      button_url.addEventListener("click", () => {
        const currURL = images[imageIndex].getAttribute("src");
        let imgURL = prompt(
          "Please enter image url",
          currURL && currURL.includes(this.defaultImage) ? "" : currURL
        );

        // set image to default if user enter an empty url.
        if (imgURL == "") {
          imgURL = "assets/" + this.defaultImage;
        }
        if (imgURL != null) {
          this.updateImage(imageIndex, imgURL);
          this.updateImageInTextXML(imageIndex, imgURL);
        }
        images[imageIndex].insertAdjacentElement("beforebegin", button_delete);

        button_delete.addEventListener("click", () => {
          let imgURL = "assets/" + this.whiteImage;
          this.updateImage(imageIndex, imgURL);
          this.updateImageInTextXML(imageIndex, imgURL);

          button_delete.remove();
        });
      });

      button_local.addEventListener("click", () => {
        button_local.onchange = (e) => {
          ((e, i) => {
            // @ts-ignore
            const f = e.target.files[0];
            const filereader = new FileReader();
            filereader.onloadend = () => {
              // @ts-ignore
              // const base64result = filereader.result.substr(filereader.result.indexOf(",") + 1);

              console.log("fileReader result:", filereader.result);
              // @ts-ignore
              this.updateImage(i, filereader.result);
              // @ts-ignore
              this.updateImageInTextXML(i, filereader.result); //here we call some other functions which most likely don't cause any problems
            };
            filereader.readAsDataURL(f);
          })(e, imageIndex);

          // this.picked(e);
        };
        images[imageIndex].insertAdjacentElement("beforebegin", button_delete);

        button_delete.addEventListener("click", () => {
          let imgURL = "assets/" + this.whiteImage;
          this.updateImage(imageIndex, imgURL);
          this.updateImageInTextXML(imageIndex, imgURL);

          //this.picked(null);

          button_delete.remove();
        });
      });
    }
  }

  imgBase64: any = null;

  //pick the image from local and update to the html
  public picked(event: any) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.handleInputChange(file); //turn into base64
      // let url_local = URL.createObjectURL(file);
      // this.updateImage(imageIndex, url_local);
      // this.updateImageInTextXML(imageIndex, url_local);
    } else {
      console.log("No file selected");
      console.log(fileList);
      alert("No file selected");
    }
  }

  handleInputChange(file: any) {
    const pattern = /image-*/;
    const reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert("invalid format");
      return;
    }
    reader.onloadend = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e: any) {
    let reader = e.target;

    const base64result = reader.result.substr(reader.result.indexOf(",") + 1);

    this.imgBase64 = base64result;

    this.updateImage(0, reader.result);
    this.updateImageInTextXML(0, reader.result);
  }

  download() {
    // @ts-ignore
    const readalongRoot: any = document.querySelector("read-along").shadowRoot;
    const pages = readalongRoot.querySelectorAll(".page");

    pages.forEach((page: any) => {
      const p = document.createElement("div");
      p.innerHTML =
        "    <script>\n" +
        "      var loadFile = function (event) {\n" +
        '        var image = document.getElementById("output");\n' +
        "        image.src = URL.createObjectURL(event.target.files[0]);\n" +
        "      };\n" +
        "    </script>" +
        "<p>\n" +
        "      <input\n" +
        '        type="file"\n' +
        '        accept="image/*"\n' +
        '        name="image"\n' +
        '        id="file"\n' +
        '        onchange="loadFile(event)"\n' +
        "      />\n" +
        "    </p>\n" +
        '    <p><label for="file" style="cursor: pointer">Upload Image</label></p>\n' +
        '    <p><img id="output" width="200" /></p>\n' +
        "\n";

      page.append(p);
    });

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
    console.log("element:", element);
    element.download = "readalong.html";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}
