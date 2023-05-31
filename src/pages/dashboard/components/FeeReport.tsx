import {
  Box,
  Card,
  CardBody,
  Center,
  HStack,
  StackDivider,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  ArcElement,
  Chart as ChartJS,
  Colors,
  Legend,
  Tooltip,
} from "chart.js";
import * as numeral from "numeral";
import React from "react";
import { Pie } from "react-chartjs-2";
import { NoData } from "../../../components/NoData";
import { FeeReport as Fee } from "../type";

ChartJS.register(ArcElement, Tooltip, Legend, Colors);

type Props = {
  type: "income" | "expense";
  item: Fee;
};
export const FeeReport = (props: Props) => {
  const { type = "income", item } = props;

  const calData =
    type === "income"
      ? { total: item.totalIncome, data: item.income }
      : { total: item.totalExpense, data: item.expense };

  const statLabel =
    type === "income" ? (
      <StatLabel color="green.500">Income</StatLabel>
    ) : (
      <StatLabel color="red.500">Expense</StatLabel>
    );

  const data = {
    labels: calData.data.map((x) => x.category.name),
    datasets: [
      {
        label: "%",
        data: calData.data.map((x) => x.percent),
        borderWidth: 1,
      },
    ],
  };

  return (
    <React.Fragment>
      <Card size="sm">
        <CardBody>
          <HStack divider={<StackDivider />}>
            <Stat>
              {statLabel}
              <StatNumber>{numeral(calData.total).format("0,0")}đ</StatNumber>
            </Stat>
          </HStack>
        </CardBody>
      </Card>

      <Card size="sm" my={1}>
        <CardBody>
          <Center h={300}>
            {calData.data.length ? (
              <Pie
                data={data}
                style={{ height: 300, width: 200 }}
                options={{ maintainAspectRatio: false, responsive: true }}
              />
            ) : (
              <NoData />
            )}
          </Center>
        </CardBody>
      </Card>

      <Card size="sm" my={1}>
        <CardBody>
          <Box>
            <TableContainer h="300" overflowY="unset">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Category</Th>
                    <Th>Amount</Th>
                    <Th>Percent</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {calData.data.length ? (
                    calData.data.map((x) => (
                      <Tr key={x.category.id}>
                        <Td>{x.category.name}</Td>
                        <Td>{numeral(x.amount).format("0,0")}đ</Td>
                        <Td>{x.percent}%</Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={3}>
                        <NoData />
                      </Td>
                    </Tr>
                  )}
                </Tbody>
                <Tfoot></Tfoot>
              </Table>
            </TableContainer>
          </Box>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};
