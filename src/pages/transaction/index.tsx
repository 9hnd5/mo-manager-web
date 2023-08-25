import {
  Box,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import * as dayjs from "dayjs";
import { FormProvider, useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { FloatingButton } from "../../components/FloatingButton";
import { DailyTransactionList } from "./components/DailyTransactionList";
import { FormValue, TransactionForm } from "./components/Form";
import { MonthlyTransactionList } from "./components/MonthlyTransactionList";
import { useTransactionStore } from "./store";

export const TransactionItem = () => {
  const formMethod = useForm<FormValue>({
    defaultValues: {
      type: "income",
      date: dayjs(new Date()).format("YYYY-MM-DD"),
    },
  });

  const toggleForm = useTransactionStore((s) => s.toggleForm);

  return (
    <FormProvider {...formMethod}>
      <FloatingButton onClick={toggleForm}>
        <Icon as={FiPlus} />
      </FloatingButton>
      <Tabs variant="unstyled" colorScheme="green">
        <TabList>
          <Tab
            borderRadius={50}
            fontWeight="bold"
            _selected={{ color: "white", bg: "green.500" }}
          >
            Monthly
          </Tab>
          <Box mx={1}></Box>
          <Tab
            borderRadius={50}
            fontWeight="bold"
            _selected={{ color: "white", bg: "green.500" }}
          >
            Daily
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            <MonthlyTransactionList />
          </TabPanel>
          <TabPanel px={0}>
            <DailyTransactionList />
          </TabPanel>
        </TabPanels>
      </Tabs>
      <TransactionForm />
    </FormProvider>
  );
};
