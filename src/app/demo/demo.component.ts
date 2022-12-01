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

  initAddImagesButton: boolean = false;
  editImageMode: boolean = false;

  constructor(private b64Service: B64Service) {}

  ngOnInit(): void {
    this.initImageForEachPage();
  }

  updateImageInHTML(pageIndex: number, url: string) {
    // @ts-ignore
    const readalongRoot: any = document.querySelector("read-along").shadowRoot;
    const images = readalongRoot.querySelectorAll(".image");
    images[pageIndex].setAttribute("src", url);
  }

  updateImageInTextXML(pageIndex: number, url: string) {
    console.log("base64[1]: ", this.b64Inputs[1]);
    const textXML = this.b64Service.b64_to_utf8(
      this.b64Inputs[1].substring(this.b64Inputs[1].indexOf(",") + 1)
    );

    const parser = new DOMParser();
    const doc = parser.parseFromString(textXML, "application/xml");
    const page = doc.querySelectorAll("div[type=page]")[pageIndex];

    let graphic = page.querySelector("graphic");

    // add graphic element if it doesn't exist
    if (graphic == null) {
      // page.insertAdjacentHTML("afterbegin", "<graphic url={{this.whiteImage}}/>");
      page.insertAdjacentHTML(
        "afterbegin",
        `<graphic url="${this.whiteImage}"/>`
      );
    }

    graphic = page.querySelector("graphic");

    console.log("pageIndex, url", pageIndex, url);

    if (url == null || url.length == 0 || url.includes(this.whiteImage)) {
      console.log("here");
      graphic?.parentNode?.removeChild(graphic);
    } else {
      graphic?.setAttribute("url", url);
    }

    const serializer = new XMLSerializer();
    const xmlStr = serializer.serializeToString(doc);

    console.log("XML after: ", xmlStr);

    this.b64Inputs[1] =
      this.b64Inputs[1].slice(0, this.b64Inputs[1].indexOf(",") + 1) +
      this.b64Service.utf8_to_b64(xmlStr);
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
      // page.insertAdjacentHTML("afterbegin", "<graphic url={{this.whiteImage}}/>");
      page.insertAdjacentHTML(
        "afterbegin",
        `<graphic url="${this.whiteImage}"/>`
      );

      //page.querySelector(image.parentNode)
    });

    const serializer = new XMLSerializer();
    const xmlStr = serializer.serializeToString(doc);
    console.log("textXML after:", xmlStr);

    this.b64Inputs[1] =
      this.b64Inputs[1].slice(0, this.b64Inputs[1].indexOf(",") + 1) +
      this.b64Service.utf8_to_b64(xmlStr);
  }

  updateEditImagesState(): void {
    if (!this.initAddImagesButton) {
      this.addUploadImageButton();
      this.initAddImagesButton = true;
      this.editImageMode = true;
    } else {
      this.editImageMode = !this.editImageMode;
      if (this.editImageMode) {
        this.displayImageContainers(true);
      } else {
        console.log("delete graphics");
        this.displayImageContainers(false);
        this.deleteGraphicsInXML();
      }
    }
  }

  // delete all graphics in text XML
  deleteGraphicsInXML(): void {
    console.log("inside deleteGraphicsInXML");
    // @ts-ignore
    const readalongRoot: any = document.querySelector("read-along").shadowRoot;
    const images = readalongRoot.querySelectorAll(".image");
    for (let i = 0; i < images.length; i++) {
      this.updateImageInTextXML(i, "");
    }
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
      button_delete.innerHTML = "Delete Image";

      const buttonDiv = document.createElement("div");
      buttonDiv.style.flexDirection = "column";

      const buttonLocalDiv = document.createElement("div");
      buttonLocalDiv.insertAdjacentElement("afterbegin", button_local);

      const buttonURLDiv = document.createElement("div");
      buttonURLDiv.insertAdjacentElement("afterbegin", button_url);

      buttonDiv.insertAdjacentElement("afterbegin", buttonLocalDiv);
      buttonDiv.insertAdjacentElement("afterbegin", buttonURLDiv);

      imageContainers[imageIndex].insertAdjacentElement(
        "afterbegin",
        buttonDiv
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
          this.updateImageInHTML(imageIndex, imgURL);
          this.updateImageInTextXML(imageIndex, imgURL);
        }
        images[imageIndex].insertAdjacentElement("beforebegin", button_delete);

        button_delete.addEventListener("click", () => {
          let imgURL = "assets/" + this.whiteImage;
          this.updateImageInHTML(imageIndex, imgURL);
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
              this.updateImageInHTML(i, filereader.result);
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
          this.updateImageInHTML(imageIndex, imgURL);
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

    this.updateImageInHTML(0, reader.result);
    this.updateImageInTextXML(0, reader.result);
  }

  /**
   * hide or display all image containers
   *
   * @param display
   */
  displayImageContainers(display: boolean) {
    //@ts-ignore
    const readalongRoot: any = document.querySelector("read-along").shadowRoot;

    const imageContainers = readalongRoot.querySelectorAll(".image__container");
    for (let i = 0; i < imageContainers.length; i++) {
      const imageContainer = imageContainers[i];

      if (display) {
        imageContainer.style.display = "block";
      } else {
        // set image to default blank image
        let imgURL = "assets/" + this.whiteImage;
        this.updateImageInHTML(i, imgURL);

        // hide the image container
        imageContainer.style.display = "none";
      }
    }
  }

  /**
   * remove <graphics> elements with empty or default image in text XML
   * to avoid broken images.
   */
  removeEmptyImageInTextXML() {
    const textXML = this.b64Service.b64_to_utf8(
      this.b64Inputs[1].substring(this.b64Inputs[1].indexOf(",") + 1)
    );

    const parser = new DOMParser();
    const doc = parser.parseFromString(textXML, "application/xml");
    const pages = doc.querySelectorAll("div[type=page]");

    for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
      const graphic = pages[pageIndex].querySelector("graphic");

      if (graphic != null) {
        // @ts-ignore
        const graphicURL: string = graphic.getAttribute("url");
        console.log("graphic url: ", graphicURL);

        if (graphicURL.includes(this.whiteImage) || !this.editImageMode) {
          // @ts-ignore
          graphic.parentNode.removeChild(graphic);
        }
      }
    }

    const serializer = new XMLSerializer();
    const xmlStr = serializer.serializeToString(doc);

    this.b64Inputs[1] =
      this.b64Inputs[1].slice(0, this.b64Inputs[1].indexOf(",") + 1) +
      this.b64Service.utf8_to_b64(xmlStr);
  }

  restoreEmptyImageInTextXML() {
    const textXML = this.b64Service.b64_to_utf8(
      this.b64Inputs[1].substring(this.b64Inputs[1].indexOf(",") + 1)
    );

    const parser = new DOMParser();
    const doc = parser.parseFromString(textXML, "application/xml");
    const pages = doc.querySelectorAll("div[type=page]");

    for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
      const graphic = pages[pageIndex].querySelector("graphic");

      if (graphic == null) {
        // pages[pageIndex].insertAdjacentHTML(
        //   "afterbegin",
        //   "<graphic url={{this.whiteImage}}/>"
        // );
        pages[pageIndex].insertAdjacentHTML(
          "afterbegin",
          `<graphic url="${this.whiteImage}"/>`
        );
      }
    }

    const serializer = new XMLSerializer();
    const xmlStr = serializer.serializeToString(doc);

    this.b64Inputs[1] =
      this.b64Inputs[1].slice(0, this.b64Inputs[1].indexOf(",") + 1) +
      this.b64Service.utf8_to_b64(xmlStr);
  }

  download() {
    // this.removeEmptyImageInTextXML();

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

    // this.restoreEmptyImageInTextXML();
  }
}
