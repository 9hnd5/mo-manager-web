import { TypedDocumentNode, gql, useQuery } from "@apollo/client";
import { Flex, Grid, GridItem, Input } from "@chakra-ui/react";
import * as dayjs from "dayjs";
import React from "react";
import { Transaction } from "../type";
import { Header } from "./Header";
import { TransactionItem } from "./Item";

// eslint-disable-next-line react-refresh/only-export-components
export const GET_TRANSACTIONS: TypedDocumentNode<
  { transactions: Transaction[] },
  { createdById?: number; fromDate?: string; toDate?: string }
> = gql`
  query GetTransactions($createdById: Int, $fromDate: Date, $toDate: Date) {
    transactions(
      createdById: $createdById
      fromDate: $fromDate
      toDate: $toDate
    ) {
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

export const DailyTransactionList = () => {
  const [searchMonth, setSearchMonth] = React.useState(
    dayjs(new Date()).format("YYYY-MM")
  );
  const fromDate = dayjs(searchMonth).startOf("month").format("YYYY-MM-DD");
  const toDate = dayjs(searchMonth).endOf("month").format("YYYY-MM-DD");

  const { data = { transactions: [] } } = useQuery(GET_TRANSACTIONS, {
    variables: {
      createdById: 1,
      fromDate,
      toDate,
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
    <Grid gap={4}>
      <GridItem>
        <Flex justifyContent="space-between">
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
  );
};
