import { TypedDocumentNode, gql, useQuery } from "@apollo/client";
import { Button, Flex, Grid, GridItem, Input } from "@chakra-ui/react";
import * as dayjs from "dayjs";
import { FormProvider, useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { useTransactionStore } from "../store";
import { Transaction } from "../type";
import { FormValue, TransactionForm } from "./Form";
import { Header } from "./Header";
import { TransactionItem } from "./Item";
import React from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const GET_TRANSACTIONS: TypedDocumentNode<
  { transactions: Transaction[] },
  { createdById: number; date: string }
> = gql`
  query GetTransactions($createdById: Int, $date: Date) {
    transactions(createdById: $createdById, date: $date) {
      id
      date
      income
      expense
      transactionItems {
        id
        amount
        account {
          id
          name
          createdById
        }
        type
        note
        category {
          id
          name
          createdById
        }
      }
    }
  }
`;

export const TransactionList = () => {
  const formMethod = useForm<FormValue>({
    defaultValues: {
      type: "income",
      date: dayjs(new Date()).format("YYYY-MM-DD"),
    },
  });

  const toggleForm = useTransactionStore((s) => s.toggleForm);

  const [searchMonth, setSearchMonth] = React.useState(
    dayjs(new Date()).format("YYYY-MM")
  );

  const { data = { transactions: [] } } = useQuery(GET_TRANSACTIONS, {
    variables: {
      createdById: 1,
      date: searchMonth,
    },
  });

  const [totalIncome, totalExpense] = data.transactions.reduce(
    (prev, curr) => {
      return [prev[0] + curr.income, prev[1] + curr.expense];
    },
    [0, 0]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchMonth(e.target.value);
  };

  return (
    <FormProvider {...formMethod}>
      <Grid gap={4}>
        <GridItem>
          <Flex justifyContent="space-between">
            <Button
              colorScheme="green"
              leftIcon={<FiPlus />}
              onClick={toggleForm}
            >
              Add More
            </Button>
            <Input
              type="month"
              bg="white"
              w={200}
              value={searchMonth}
              onChange={handleChange}
            />
          </Flex>
        </GridItem>
        <GridItem>
          <Header income={totalIncome} expense={totalExpense} />
        </GridItem>
        {data.transactions.map((item) => (
          <GridItem key={item.id}>
            <TransactionItem item={item} />
          </GridItem>
        ))}
      </Grid>
      <TransactionForm />
    </FormProvider>
  );
};
