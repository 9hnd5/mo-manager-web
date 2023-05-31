import { Grid, GridItem, Skeleton } from "@chakra-ui/react";
import { FeeReport } from "./components/FeeReport";
import { SearchBar } from "./components/SearchBar";
import { TypedDocumentNode, gql, useQuery } from "@apollo/client";
import { FeeReport as Fee } from "./type";
import React from "react";
import dayjs from "dayjs";

// eslint-disable-next-line react-refresh/only-export-components
export const GET_FEE_REPORT: TypedDocumentNode<
  { feeReport: Fee },
  { date: string }
> = gql`
  query GetFeeReport($date: Date!) {
    feeReport(date: $date) {
      totalIncome
      totalExpense
      income {
        amount
        percent
        category {
          id
          name
        }
      }
      expense {
        amount
        percent
        category {
          id
          name
        }
      }
    }
  }
`;

export const Dashboard = () => {
  const [searchDate, setSearchDate] = React.useState(
    dayjs(new Date()).format("YYYY-MM")
  );

  const query = useQuery(GET_FEE_REPORT, {
    variables: { date: searchDate },
  });

  if (query.loading) return <Skeleton />;

  const handleSearchDateChange = (e: any) => {
    setSearchDate(e.target.value);
  };

  return (
    <Grid gap={1}>
      <GridItem>
        <SearchBar
          searchDate={searchDate}
          onSearchDateChange={handleSearchDateChange}
        />
      </GridItem>
      <GridItem>
        <Grid templateColumns="repeat(2, 1fr)" gap={1}>
          <GridItem colSpan={1}>
            <FeeReport type="income" item={query.data!.feeReport} />
          </GridItem>
          <GridItem colSpan={1}>
            <FeeReport type="expense" item={query.data!.feeReport} />
          </GridItem>
        </Grid>
      </GridItem>
    </Grid>
  );
};
