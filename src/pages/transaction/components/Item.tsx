import {
  Badge,
  Box,
  Card,
  CardBody,
  CardHeader,
  Center,
  Divider,
  Flex,
  Stack,
  StackDivider,
  Stat,
  StatNumber,
  Text,
  VStack,
  useBreakpoint,
} from "@chakra-ui/react";
import * as numeral from "numeral";
import { useFormContext } from "react-hook-form";
import { Transaction } from "../type";
import { FormValue } from "./Form";
import { useTransactionStore } from "../store";
import * as dayjs from "dayjs";
type Props = {
  item: Transaction;
};

export const TransactionItem = (props: Props) => {
  const toggleForm = useTransactionStore((s) => s.toggleForm);

  const { reset } = useFormContext<FormValue>();

  const { item } = props;

  const value = useBreakpoint({ ssr: false });

  const handleSelected = (i: Transaction["transactionItems"][0]) => {
    reset(
      { ...i, date: dayjs(item.date).format("YYYY-MM-DD") },
      { keepDefaultValues: true }
    );
    toggleForm();
  };

  return (
    <Card size="sm">
      <CardHeader>
        <Flex
          justifyContent={{ base: "space-between", sm: "space-between" }}
          alignItems={{ base: "flex-start", sm: "center" }}
          direction={{ base: "row", sm: "row" }}
          gap={2}
        >
          <Box>
            <Badge>
              <Text fontSize="sm">{item.date}</Text>
            </Badge>
          </Box>
          {value === "base" ? (
            <VStack>
              <Box>
                <Stat color="green.400">
                  <StatNumber>{numeral(item.income).format("0,0")}đ</StatNumber>
                </Stat>
              </Box>
              <Box>
                <Stat color="red.400">
                  <StatNumber>
                    {numeral(item.expense).format("0,0")}đ
                  </StatNumber>
                </Stat>
              </Box>
            </VStack>
          ) : (
            <>
              <Box>
                <Stat color="green.400">
                  <StatNumber>{numeral(item.income).format("0,0")}đ</StatNumber>
                </Stat>
              </Box>
              <Box>
                <Stat color="red.400">
                  <StatNumber>
                    {numeral(item.expense).format("0,0")}đ
                  </StatNumber>
                </Stat>
              </Box>
            </>
          )}
        </Flex>
      </CardHeader>
      <Divider color="gray.300" />
      <CardBody>
        <Stack divider={<StackDivider />}>
          {item.transactionItems.map((i, index) => (
            <Flex
              justifyContent="space-between"
              alignItems="center"
              gap={2}
              key={index}
              cursor="pointer"
              onClick={() => handleSelected(i)}
            >
              <Box flex="1">
                <Badge color="green.400">
                  <Text>{i.category.name}</Text>
                </Badge>
              </Box>
              <Box flex="1">
                <Text noOfLines={1}>{i.note}</Text>
                <Text fontSize="xs" noOfLines={1}>
                  {i.account.name}
                </Text>
              </Box>
              <Box flex="1">
                <Flex justifyContent="flex-end">
                  {i.type === "income" ? (
                    <Text color="green.400">
                      {numeral(i.amount).format("0,0")}đ
                    </Text>
                  ) : (
                    <Text color="red.400">
                      {numeral(i.amount).format("0,0")}đ
                    </Text>
                  )}
                </Flex>
              </Box>
            </Flex>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
};
