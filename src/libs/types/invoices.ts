export declare type IInvoice = {
  key?: string;
  balanceAmount?: number;
  createdAt?: string;
  currency?: string;
  customFields?: {
    key: string;
    value: string;
  }[];
  customer?: {
    id?: string;
    addresses: any;
  }
  description?: string;
  dueDate?: string;
  extensions?: any;
  invoiceDate?: string;
  invoiceId?: string;
  invoiceNumber?: string;
  invoiceSubTotal: number;
  isInsured?: boolean;
  isRegulated?: boolean;
  merchant?: {
    id?: string;
  }
  numberOfDocuments: number;
  purchaseOrderMatched?: boolean;
  status?: {
    key?: string;
    value?: boolean;
  }[];
  subStatus?: any;
  totalAmount: number;
  totalDiscount: number;
  totalPaid: number;
  totalTax: number;
  type?: string;
  version?: string;
}
