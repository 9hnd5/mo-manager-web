import { StateCreator } from "zustand";
export type TransactionSlice = {
  isOpenForm: boolean;
  toggleForm: () => void;
};
export const createTransactionSlice: StateCreator<
  TransactionSlice,
  [],
  [],
  TransactionSlice
> = (set) => ({
  isOpenForm: false,
  toggleForm: () => set((s) => ({ isOpenForm: !s.isOpenForm })),
});
