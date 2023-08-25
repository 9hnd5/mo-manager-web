import { Box, Card, CardBody, Flex, Text } from "@chakra-ui/react";
import * as numeral from "numeral";

type Props = {
  income: number;
  expense: number;
};
export const Header = (props: Props) => {
  const { income, expense } = props;
  return (
    <Card size="sm">
      <CardBody>
        <Flex justifyContent="space-between">
          <Box>
            <Text>Income</Text>
            <Text color="green.500">{numeral(income).format("0,0")}đ</Text>
          </Box>
          <Box>
            <Text>Expense</Text>
            <Text color="red.500">{numeral(expense).format("0,0")}đ</Text>
          </Box>
          <Box>
            <Text>Total</Text>
            <Text>{numeral(income - expense).format("0,0")}đ</Text>
          </Box>
        </Flex>
      </CardBody>
    </Card>
  );
};
