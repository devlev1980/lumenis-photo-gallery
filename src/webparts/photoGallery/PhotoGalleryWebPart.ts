import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

/*import styles from './PhotoGalleryWebPart.module.scss';*/
import * as strings from 'PhotoGalleryWebPartStrings';

import {
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';
import {
  Environment,
  EnvironmentType
} from '@microsoft/sp-core-library';

import * as $ from 'jquery';
//import './PhotoGalleryScript.js';
// import './PhotoGallery.css';

require('./PhotoGalleryWebPart.scss');


export interface IPhotoGalleryWebPartProps {
  photoGalleryTitle: string;
  linksImagesTitle: string;
  description: string;
  photosLibraryName: string;
  Link1: string;
  Link1Text: string;
  LinkImage1: string;
  Link2: string;
  Link2Text: string;
  //LinkImage2: string;
  Link3: string;
  Link3Text: string;
  //LinkImage3: string;
  Link4: string;
  Link4Text: string;
  //LinkImage4: string;
}

export interface ISPLists {
  Files: ISPList[];
}

export interface ISPList {
  ServerRelativeUrl: string;
  ListItemAllFields: ISPField;
}

export interface ISPField {
  Title: string;
  Date: string;
  ImageTitle: string;
  Link: string;
}

export default class PhotoGalleryWebPart extends BaseClientSideWebPart<IPhotoGalleryWebPartProps> {

  private slideIndex: number = 1;

  public static getAbsoluteDomainUrl(): string {
    if (window
      && "location" in window
      && "protocol" in window.location
      && "host" in window.location) {
      return window.location.protocol + "//" + window.location.host;
    }
    return null;
  }

  private _getFiles(): Promise<ISPLists> {
    return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/Web/GetFolderByServerRelativeUrl('${escape(this.properties.photosLibraryName)}')?$expand=Files`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      });
  }
  private _getPropertiesFields() {
    return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/Web/GetFolderByServerRelativeUrl('${escape(this.properties.photosLibraryName)}')/Files?$select=ListItemAllFields/Date,ListItemAllFields/ImageTitle,ListItemAllFields/Link&$expand=ListItemAllFields`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      });
  }

  private _renderListAsync(): void {

    if (Environment.type == EnvironmentType.SharePoint ||
      Environment.type == EnvironmentType.ClassicSharePoint) {
      this._getFiles()
        .then((response) => {
          this._renderList1(response.Files);
        });
      this._getPropertiesFields()
        .then((response) => {
          this._renderList2(response.value);
        });
    }
  }

  private _renderList1(items: ISPList[]): void {
    let html: string = '';
    let index: number = 0;
    items.forEach((item: ISPList) => {
      if (index == 0) {
        html += `

          <div class="image-item" style="border-left: 1px solid lightgray;">
              <img src="${PhotoGalleryWebPart.getAbsoluteDomainUrl()}${item.ServerRelativeUrl}">
          </div>`;
      }
      else {
        html += `
          <div class="image-item" style="border-left: 1px solid lightgray;"><img src="${PhotoGalleryWebPart.getAbsoluteDomainUrl()}${item.ServerRelativeUrl}"></div>`;
      }
      index++;
    });

    const slidesShowContainer: Element = this.domElement.querySelector('#slidesShow-Container');
    slidesShowContainer.innerHTML = html;

    let btnNext = document.getElementById("prev");
    btnNext.addEventListener("click", (e: Event) => this.plusSlides(-1));
    let btnPrev = document.getElementById("next");
    btnPrev.addEventListener("click", (e: Event) => this.plusSlides(1));
  }

  private _renderList2(items: ISPList[]): void {
    let html: string = '';
    let html2: string = '';
    let num = -8.5;
    const mySlides: Element = this.domElement.querySelector('#mySlides');
    const slidesShowContainer: Element = this.domElement.querySelector('#FileProperties');
    const afterSlidesShowContainer: Element = this.domElement.querySelector('#after-slidesShow-Container');

    items.forEach((item: ISPList) => {
      num = num + 10;
      html += `
          <div >
          <img src="https://lumenis.sharepoint.com/sites/Portal/Site%20Assets/Homepage%20design/image%20gallery/icon_camera.jpg" alt="icon" style="float:right;">
          <label>${item.ListItemAllFields.Date}</label>
          <br><label>${item.ListItemAllFields.ImageTitle}</label></div>`;

      html2 += `<div ><a href="${item.ListItemAllFields.Link}"> קרא עוד ></a></div>`;


    });

    slidesShowContainer.innerHTML = html;
    afterSlidesShowContainer.innerHTML = html2;
  }

  private  plusSlides(n: number) {
    this.showSlides(this.slideIndex += n);
  }

  private showSlides(n: number): void {
    var i: number;
    var slides = document.getElementsByClassName("mySlides");
    if (n > slides.length) { this.slideIndex = 1; }
    if (n < 1) { this.slideIndex = slides.length; }
    for (i = 0; i < slides.length; i++) {
      slides[i].setAttribute("style", "display:none;");
    }
    slides[this.slideIndex - 1].setAttribute("style", "display:block;");
  }

  public render(): void {

    let NumberOfActiveLinks = 0;
    if (this.properties.Link1 != "") {
      NumberOfActiveLinks += 1;
    }
    if (this.properties.Link2 != "") {
      NumberOfActiveLinks += 1;
    }
    if (this.properties.Link3 != "") {
      NumberOfActiveLinks += 1;
    }
    if (this.properties.Link4 != "") {
      NumberOfActiveLinks += 1;
    }

    if (NumberOfActiveLinks != 0 && NumberOfActiveLinks != 8) {
      NumberOfActiveLinks = (100 - 12.5 * NumberOfActiveLinks) / 2;
    }
    else NumberOfActiveLinks = 0;

    let MarginLeft = NumberOfActiveLinks.toString() + "%";

    let html = `<div id="PhotoGalleryWebpartWrapper">

<!--                  <div id="Title">-->
<!--                    <h2  style="color: #040507";>${this.properties.linksImagesTitle}</h2>-->
<!--                    <h1 style="color: #040507;">${this.properties.photoGalleryTitle}</h1>-->
<!--                  </div>-->

                                  <div id="LinksImages">`;

    html += `<div class="LinksWrapper2">

                                  <div class="LinksWrapper-Raw2" > <h2  style="color: #040507";>${this.properties.linksImagesTitle}</h2>` ;
    if (this.properties.Link1 != "") {
      html += `<div class="LinksTab2" >
                                    <div class="LinkImage2" >
                                      <a href="${escape(this.properties.Link1)}">
                                      <img class="ImageInLink2" width="100%"   src="${escape(this.properties.LinkImage1)}">
                                      </a>
                                      <br>
                                    </div>
                                  </div>`;
    }
    if (this.properties.Link2 != "") {
      html += `<div class="LinksTab2">
                                    <div class="LinkImage2">
                                      <button type="button" class="ImageInLink2" onclick="location.href='${this.properties.Link2}';">${this.properties.Link2Text}</button>
                                    </div>
                                  </div>`;
                                  // <a href="${escape(this.properties.Link2)}"><img class="ImageInLink2" style="width: 11.3vw; height: 1.58vw;" src="${escape(this.properties.LinkImage2)}"></a><br>
    }
    if (this.properties.Link3 != "") {
      html += `<div class="LinksTab2">
                                    <div class="LinkImage2">
                                      <button type="button" class="ImageInLink2" onclick="location.href='${this.properties.Link3}';">${this.properties.Link3Text}</button>
                                    </div>
                                  </div>`;
                                  // <a href="${escape(this.properties.Link3)}"><img class="ImageInLink2" style="width: 11.3vw; height: 1.58vw;" src="${escape(this.properties.LinkImage3)}"></a><br>
    }
    if (this.properties.Link4 != "") {
      html += `<div class="LinksTab2">
                                    <div class="LinkImage2">
                                      <button type="button" class="ImageInLink2" onclick="location.href='${this.properties.Link4}';">${this.properties.Link4Text}</button>
                                    </div>
                                  </div>`;
                                  // <a href="${escape(this.properties.Link4)}"><img class="ImageInLink2" style="width: 11.3vw; height: 1.58vw;" src="${escape(this.properties.LinkImage4)}"></a><br>

      html += `</div>

                                   <div id="PhotoGalleryTable">
                                                                   <div id="Title">
                                   <h2  style="color: #040507";>${this.properties.photoGalleryTitle}</h2>
</div>
                                     <div style="width:100%;">
                                     <div id="FileProperties">
                                    </div>
                                    <div id="slidesShow-Container">
                                     </div>
                                    <div id="after-slidesShow-Container">
                                     </div>
                                    </div>
                                   </div>

                                  </div
                                </div>`;
    }
    this.domElement.innerHTML = html;

    this._renderListAsync();
  }


  // protected get dataVersion(): Version {
  //   return Version.parse('1.0');
  // }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupFields: [
                PropertyPaneTextField('photoGalleryTitle', {
                  label: 'Enter photos gallery element title'
                }),
                PropertyPaneTextField('photosLibraryName', {
                  label: 'Enter photos library name'
                })
              ]
            },
            {
              groupName: 'Link 1',
              groupFields: [
                PropertyPaneTextField('linksImagesTitle', {
                  label: 'Enter links images element title'
                }),
                PropertyPaneTextField('Link1', {
                  label: 'Enter link to page'
                }),
                PropertyPaneTextField('LinkImage1', {
                  label: 'Enter link to image'
                }),
              ]
            },
            {
              groupName: 'Link 2',
              groupFields: [
                PropertyPaneTextField('Link2', {
                  label: 'Enter link to page'
                }),
                PropertyPaneTextField('Link2Text', {
                  label: 'Enter text to display'
                }),
              ]
            },
            {
              groupName: 'Link 3',
              groupFields: [
                PropertyPaneTextField('Link3', {
                  label: 'Enter link to page'
                }),
                PropertyPaneTextField('Link3Text', {
                  label: 'Enter text to display'
                }),
              ]
            },
            {
              groupName: 'Link 4',
              groupFields: [
                PropertyPaneTextField('Link4', {
                  label: 'Enter link to page'
                }),
                PropertyPaneTextField('Link4Text', {
                  label: 'Enter text to display'
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}

