import { create } from "zustand";
import { TransactionSlice, createTransactionSlice } from "../transaction/slice";

export const useStore = create<TransactionSlice>()((...a) => ({
  ...createTransactionSlice(...a),
}));
