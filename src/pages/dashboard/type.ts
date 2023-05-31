import { Category } from "../transaction/type";

export type FeeReport = {
  totalIncome: number;

  totalExpense: number;

  income: Data[];

  expense: Data[];
};

type Data = {
  category: Category;

  amount: number;

  percent: number;
};
