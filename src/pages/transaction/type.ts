export enum TransItemType {
  income = "income",
  expense = "expense",
}

export type TransactionItem = {
  id: number;
  amount: number;
  category: Category;
  account: Account;
  type: TransItemType;
  note?: string;
};

export type Transaction = {
  id: number;
  date: string;
  income: number;
  expense: number;
  transactionItems: TransactionItem[];
};

export type Category = {
  id: number;
  name: string;
  createdById: number;
};

export type Account = Category;

export type TransactionFormValue = {
  id?: number;
  date: string;
  amount: number;
  category: { id: number; name: string };
  type: string;
  account: string;
  note?: string;
};
