import { create } from "zustand";

type TransactionState = {
  isOpenForm: boolean;
  toggleForm: () => void;
};

const initialState = {
  isOpenForm: false,
} as TransactionState;
export const useTransactionStore = create<TransactionState>()((set) => ({
  ...initialState,
  toggleForm: () =>
    set((state) => {
      return { isOpenForm: !state.isOpenForm };
    }),
}));
