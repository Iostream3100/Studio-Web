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
  // default blank image as placeholder, saved in assets/ folder
  whiteImage = "white.png";
  initAddImagesButton: boolean = false;
  editImageMode: boolean = false;

  constructor(public titleService: Title, public b64Service: B64Service) {
    titleService.setTitle(this.slots.pageTitle);
  }

  ngOnInit(): void {
    if (this.b64Inputs != undefined) {
      // initialize the graphic node in text XML in each page
      // to let web-component render image-container and image with the blank white image
      this.updateImageInTextXML(this.whiteImage, undefined, false);
    }
  }

  /**
   * update image in the HTML that read-along web-component rendered
   * @param pageIndex
   * @param url
   */
  updateImageInHTML(pageIndex: number, url: string) {
    const readAlongRoot: any = document.querySelector("read-along")?.shadowRoot;

    if (readAlongRoot) {
      const images = readAlongRoot.querySelectorAll(".image");
      images[pageIndex].setAttribute("src", url);
    } else {
      console.log("Cannot locate shadow root of web-component");
    }
  }

  /**
   * update the image in text XML file
   * @param url               new image url, the format can be base64, web url,
   *                          or a relative file path like "assets/xxx.png"
   * @param pageIndex?        page index of the image,
   *                          if no pageIndex is given, all pages will be updated.
   * @param deleteEmptyImage  whether to delete the graphic node
   *                          if existing url is empty or the default image
   *                          to avoid a broken image in the downloaded HTML file
   */
  updateImageInTextXML(
    url: string,
    pageIndex?: number,
    deleteEmptyImage: boolean = false
  ) {
    // decode text XML from base64 format
    const textXML = this.b64Service.b64_to_utf8(
      this.b64Inputs[1].substring(this.b64Inputs[1].indexOf(",") + 1)
    );

    const parser = new DOMParser();
    const doc = parser.parseFromString(textXML, "application/xml");
    const pages = doc.querySelectorAll("div[type=page]");

    let pagesToUpdate: Element[];
    if (pageIndex != undefined) {
      // if page index is specified, just update the image of that page
      pagesToUpdate = [pages[pageIndex]];
    } else {
      // otherwise update all images
      pagesToUpdate = Array.from(pages);
    }
    for (let page of pagesToUpdate) {
      let graphic = page.querySelector("graphic");

      // add graphic element if it doesn't exist
      if (graphic == null) {
        page.insertAdjacentHTML(
          "afterbegin",
          `<graphic url="${this.whiteImage}"/>`
        );
      }

      graphic = page.querySelector("graphic");
      const lastURL = graphic?.getAttribute("url");
      if (url.length > 0) {
        graphic?.setAttribute("url", url);
      } else if (deleteEmptyImage) {
        // If last url is empty or the default white image,
        // remove the graphic node to avoid a broken image in the downloaded HTML file
        if (lastURL == null || lastURL.includes(this.whiteImage)) {
          graphic?.parentNode?.removeChild(graphic);
          console.log("graphic removed");
        }
      }
    }

    const serializer = new XMLSerializer();
    const xmlStr = serializer.serializeToString(doc);

    // convert back to base64 format and update text XML
    this.b64Inputs[1] =
      this.b64Inputs[1].slice(0, this.b64Inputs[1].indexOf(",") + 1) +
      this.b64Service.utf8_to_b64(xmlStr);
  }

  /**
   * enter or exit edit image mode.
   */
  updateEditImagesState(): void {
    if (!this.initAddImagesButton) {
      // initialize upload image buttons
      this.addUploadImageButton();
      this.initAddImagesButton = true;
      this.editImageMode = true;
    } else {
      this.editImageMode = !this.editImageMode;
      if (this.editImageMode) {
        this.displayImageContainers(true);
      } else {
        this.displayImageContainers(false);
        // set the url of graphics node to default
        this.updateImageInTextXML("assets/" + this.whiteImage, undefined);
      }
    }
  }

  /**
   * add upload image buttons and their event listeners
   */
  addUploadImageButton(): void {
    const readAlongRoot: any = document.querySelector("read-along")?.shadowRoot;

    if (readAlongRoot) {
      const images = readAlongRoot.querySelectorAll(".image");
      const imageContainers =
        readAlongRoot.querySelectorAll(".image__container");
      const buttonStyle = "margin-bottom: 5px";

      for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
        const buttonsDiv = document.createElement("div");
        buttonsDiv.style.cssText +=
          "padding-left: 20px; display: flex; flex-direction: column; align-items: flex-start;";

        // delete image button
        const deleteImgBtn = document.createElement("button");
        deleteImgBtn.innerHTML = "Delete Image";
        deleteImgBtn.style.cssText += buttonStyle;

        deleteImgBtn.addEventListener("click", () => {
          let defaultImageUrl = "assets/" + this.whiteImage;
          this.updateImageInHTML(imageIndex, defaultImageUrl);
          this.updateImageInTextXML(defaultImageUrl, imageIndex);
          deleteImgBtn.remove();
        });

        // upload web url image button
        const enterImgURLBtn = document.createElement("button");
        enterImgURLBtn.innerHTML = "Enter Image URL";
        enterImgURLBtn.style.cssText += buttonStyle;
        buttonsDiv.appendChild(enterImgURLBtn);

        // add event listener for uploading image from an web url
        enterImgURLBtn.addEventListener("click", () => {
          const currURL = images[imageIndex].getAttribute("src");
          let imgURL = prompt("Please enter image url", currURL ? "" : currURL);

          if (imgURL != null) {
            this.updateImageInHTML(imageIndex, imgURL);
            this.updateImageInTextXML(imgURL, imageIndex);
            // show delete button if the image is uploaded
            buttonsDiv.appendChild(deleteImgBtn);
          }
        });

        // upload local image button
        const uploadImgBtn = document.createElement("button");
        uploadImgBtn.innerHTML = "Upload Image";
        uploadImgBtn.style.cssText += buttonStyle;

        const fileInputBtn = document.createElement("input");
        fileInputBtn.type = "file";
        buttonsDiv.appendChild(uploadImgBtn);

        // add event listener for uploading local image at button_file button
        uploadImgBtn.addEventListener("click", () => {
          fileInputBtn.click();
        });

        fileInputBtn.addEventListener("click", () => {
          fileInputBtn.onchange = (e) => {
            // this function is used to pass imageIndex to the event listener
            ((event, index) => {
              const files = (event.target as HTMLInputElement).files;
              if (files == null) {
                console.log("No file selected.");
              } else {
                const file = files[0];
                const fileReader = new FileReader();

                fileReader.onloadend = () => {
                  const fileReaderResult = fileReader.result;
                  if (fileReaderResult !== null) {
                    this.updateImageInHTML(index, fileReader.result as any);
                    this.updateImageInTextXML(fileReader.result as any, index);
                    // show delete button if the image is uploaded
                    buttonsDiv.appendChild(deleteImgBtn);
                  }
                };
                fileReader.readAsDataURL(file);
              }
            })(e, imageIndex);
          };
        });

        imageContainers[imageIndex].insertAdjacentElement(
          "afterbegin",
          buttonsDiv
        );
      }
    } else {
      console.log("Cannot locate shadow root of web-component");
    }
  }

  /**
   * hide or display all image containers
   *
   * @param display Image container visibility
   */
  displayImageContainers(display: boolean) {
    const readAlongRoot: any = document.querySelector("read-along")?.shadowRoot;

    if (readAlongRoot) {
      const imageContainers =
        readAlongRoot.querySelectorAll(".image__container");
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
    } else {
      console.log("Cannot locate shadow root of web-component");
    }
  }

  onPageTitleChange(e: Event): void {
    const titleValue: string = (<HTMLTextAreaElement>e.target).value;
    this.slots.pageTitle = titleValue;
    this.titleService.setTitle(titleValue);
  }

  // click botton btn just once
  clicked = false;

  // addTranslationLine is called when the user clicks the "Add Translation" button
  addTranslationLine(): void {
    this.clicked = true;
    // @ts-ignore
    const readalongRoot: any = document.querySelector("read-along").shadowRoot;
    const sentences = readalongRoot.querySelectorAll(".sentence");
    sentences.forEach((sentence: any) => {
      const innerbutton = document.createElement("button");
      innerbutton.innerHTML = "Add Translation";
      innerbutton.addEventListener("click", () => {
        sentence.insertAdjacentHTML(
          "beforeend",
          '<br><span class = "translation" contenteditable = "True">Translation</span>'
        );
        innerbutton.remove();
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
    var textXML = this.b64Service.b64_to_utf8(
      this.b64Inputs[1].substring(this.b64Inputs[1].indexOf(",") + 1)
    );

    const parser = new DOMParser();
    const doc = parser.parseFromString(textXML, "application/xml");
    // if translation class exist, delete it
    if (doc.querySelector(".translation") != null) {
      doc.querySelectorAll(".translation").forEach((node) => {
        node.remove();
      });
    }
    const ss = doc.querySelectorAll("s");
    let count = 0;
    ss.forEach((tag_s) => {
      tag_s.insertAdjacentHTML(
        "afterend",
        `<span class="translation" contenteditable="true">${translation[count].innerHTML}</span>`
      );
      count++;
    });

    const serializer = new XMLSerializer();
    const xmlStr = serializer.serializeToString(doc);
    this.b64Inputs[1] =
      this.b64Inputs[1].slice(0, this.b64Inputs[1].indexOf(",") + 1) +
      this.b64Service.utf8_to_b64(xmlStr);
  }

  download() {
    if (this.clicked) {
      // recall updatetextXML()
      this.updateTextXML();
    }

    // delete empty image in text XML to avoid broken images.
    this.updateImageInTextXML("", undefined, true);

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
