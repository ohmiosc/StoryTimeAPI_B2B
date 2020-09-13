export interface IProductModel {
  id: string;
  creationDate: string;
  lang: string;
  lastUpdateDate: string;
  pImage: string;
  pName: string;
  pState: number;
  pType: number;
  textDirection: string;
}

export class Product implements IProductModel {

  creationDate: string;
  id: string;
  lang: string;
  lastUpdateDate: string;
  pImage: string;
  pName: string;
  pState: number;
  pType: number;
  textDirection: string;

  constructor(creationDate: string, id: string, lang: string, lastUpdateDate: string, pImage: string, pName: string, pState: number, pType: number) {
    this.creationDate = creationDate;
    this.id = id;
    this.lang = lang;
    this.lastUpdateDate = lastUpdateDate;
    this.pImage = pImage;
    this.pName = pName;
    this.pState = pState;
    this.pType = pType;
  }
}
