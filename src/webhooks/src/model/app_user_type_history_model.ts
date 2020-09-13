export interface IActionHistory {
  action: 'AutoRenew'|'Cancellation';
  date: string;
  refId: number;
}

export interface IChangeTypeItem {
  date: string;
  state: string
}

export interface IAppUserTypeHistoryModel {
  id: string;
  userType: number;
  originalPurchaseDate: string;
  actionsHistory: IActionHistory[];
  lastUpdate: string;
  changeTypeHistory: IChangeTypeItem[];
}

export class AppUserTypeHistory implements IAppUserTypeHistoryModel {
  id: string;
  userType: number;
  actionsHistory: IActionHistory[];
  changeTypeHistory: IChangeTypeItem[];
  lastUpdate: string;
  originalPurchaseDate: string;

  constructor(id: string, userType: number, originalPurchaseDate: string, changeTypeHistory: IChangeTypeItem[]) {
    this.id = id;
    this.userType = userType;
    this.actionsHistory = [];
    this.changeTypeHistory = changeTypeHistory;
    this.originalPurchaseDate = originalPurchaseDate;
  }
}
