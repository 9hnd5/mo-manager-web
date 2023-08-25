import { TypedDocumentNode, gql, useMutation } from "@apollo/client";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  NumberInput,
  NumberInputField,
  InputGroup,
  InputRightElement,
  Stack,
  Tab,
  TabList,
  Tabs,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import * as numeral from "numeral";
import React from "react";
import { SubmitHandler, useFormContext } from "react-hook-form";
import { AiOutlineAccountBook } from "react-icons/ai";
import { FaMountain } from "react-icons/fa";
import { FiSave } from "react-icons/fi";
import {
  MdDateRange,
  MdDeleteForever,
  MdOutlineCategory,
} from "react-icons/md";
import { useTransactionStore } from "../store";
import { Account, Category } from "../type";
import { CategoryForm } from "./CategoryForm";
import { GET_TRANSACTIONS } from "./DailyTransactionList";
import { AccountForm } from "./AccountForm";
import { GET_FEE_REPORT } from "../../dashboard";

const CREATE_TRANSACTION_ITEM: TypedDocumentNode<any, { input: any }> = gql(`
  mutation CreateTransactionItem($input: CreateTransactionItemInput!) {
    createTransactionItem(input: $input){
      id
    }
  }
`);

const UPDATE_TRANSACTION_ITEM: TypedDocumentNode<any, { input: any }> = gql(`
  mutation UpdateTransactionItem($input: UpdateTransactionItemInput!) {
    updateTransactionItem(input: $input){
      id
    }
  }
`);

const DELETE_TRANSACTION_ITEM: TypedDocumentNode<any, { id: number }> = gql(`
mutation DeleteTransactionItem($id: Int!) {
  deteleTransactionItem(id: $id) {
    id
  }
}
`);

export type FormValue = {
  id?: number;
  date: string;
  amount: number;
  category: { id: number; name: string };
  type: string;
  account: { id: number; name: string };
  note?: string;
};

export const TransactionForm = () => {
  const { isOpenForm, toggleForm } = useTransactionStore((s) => s);

  const {
    register,
    getValues,
    setValue,
    watch,
    reset,
    handleSubmit: submit,
    formState: { errors },
  } = useFormContext<FormValue>();

  const { isOpen: isOpenCategory, onToggle: toggleCategory } = useDisclosure();

  const { isOpen: isOpenAccount, onToggle: toggleAccount } = useDisclosure();

  const [createTransItem, { loading: isCreating }] = useMutation(
    CREATE_TRANSACTION_ITEM,
    {
      refetchQueries: [GET_TRANSACTIONS, GET_FEE_REPORT],
    }
  );

  const [updateTransItem, { loading: isUpdating }] = useMutation(
    UPDATE_TRANSACTION_ITEM,
    {
      refetchQueries: [GET_TRANSACTIONS, GET_FEE_REPORT],
    }
  );

  const [deleteTransItem, { loading: isDeleting }] = useMutation(
    DELETE_TRANSACTION_ITEM,
    {
      refetchQueries: [GET_TRANSACTIONS, GET_FEE_REPORT],
    }
  );

  const type = watch("type");
  const tabIndex = type === "income" ? 0 : 1;

  const handleSubmit: SubmitHandler<FormValue> = async (data) => {
    const { category, account, amount, id, ...rest } = data;

    if (id) {
      await updateTransItem({
        variables: {
          input: {
            ...rest,
            id,
            categoryId: category.id,
            accountId: account.id,
            amount: numeral(amount).value(),
          },
        },
      });
      return handleClose();
    }

    await createTransItem({
      variables: {
        input: {
          ...rest,
          categoryId: category.id,
          accountId: account.id,
          amount: numeral(amount).value(),
        },
      },
    });
    handleClose();
  };

  const handleDelete = async () => {
    const id = getValues("id");
    id && (await deleteTransItem({ variables: { id } }));
    handleClose();
  };

  const handleTabChange = (tabIndex: number) => {
    if (tabIndex === 0) setValue("type", "income");
    if (tabIndex === 1) setValue("type", "expense");
  };

  const handleSelectCategory = (category: Category) => {
    return () => {
      setValue("category", category, { shouldValidate: true });
      toggleCategory();
    };
  };

  const handleSelectAccount = (account: Account) => {
    return () => {
      setValue("account", account, { shouldValidate: true });
      toggleAccount();
    };
  };

  const handleClose = () => {
    toggleForm();
    reset(
      { type: "income", date: dayjs(new Date()).format("YYYY-MM-DD") },
      { keepDefaultValues: true }
    );
  };

  return (
    <React.Fragment>
      <Drawer
        isOpen={isOpenForm}
        blockScrollOnMount={false}
        placement="right"
        onClose={handleClose}
      >
        <DrawerOverlay />
        <DrawerContent overflow="scroll">
          <Tabs
            index={tabIndex}
            isFitted
            variant="enclosed"
            onChange={handleTabChange}
          >
            <TabList mb="1em">
              <Tab>Income</Tab>
              <Tab>Expense</Tab>
            </TabList>
          </Tabs>

          <DrawerBody>
            <Stack>
              <FormControl isInvalid={errors.date && true} isRequired>
                <FormLabel>Date</FormLabel>
                <InputGroup>
                  <Input
                    autoFocus
                    type="date"
                    {...register("date", {
                      required: "This field is required",
                    })}
                  />
                  <InputRightElement>
                    <Icon as={MdDateRange} />
                  </InputRightElement>
                </InputGroup>

                <FormErrorMessage>
                  {errors.date && errors.date.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.amount && true} isRequired>
                <FormLabel>Amount</FormLabel>
                <NumberInput
                  format={(value) => {
                    return `${numeral(value).format("0,0")}`;
                  }}
                  inputMode="decimal"
                >
                  <InputGroup>
                    <NumberInputField
                      {...register("amount", {
                        required: "This field is required",
                        // valueAsNumber: true,
                      })}
                    />
                    <InputRightElement>
                      <Icon as={FaMountain} />
                    </InputRightElement>
                  </InputGroup>
                </NumberInput>
                <FormErrorMessage>
                  {errors.amount && errors.amount.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={errors.category && true}
                onClick={toggleCategory}
                isRequired
              >
                <FormLabel>Category</FormLabel>
                <InputGroup>
                  <Input
                    {...register("category.name", {
                      required: "This field is required",
                    })}
                    isReadOnly
                  />
                  <InputRightElement>
                    <Icon as={MdOutlineCategory} />
                  </InputRightElement>
                </InputGroup>

                <FormErrorMessage>
                  {errors.category && errors.category.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={errors.account && true}
                onClick={toggleAccount}
                isRequired
              >
                <FormLabel>Account</FormLabel>
                <InputGroup>
                  <Input
                    {...register("account.name", {
                      required: "This field is required",
                    })}
                    isReadOnly
                  />
                  <InputRightElement>
                    <Icon as={AiOutlineAccountBook} />
                  </InputRightElement>
                </InputGroup>

                <FormErrorMessage>
                  {errors.account && errors.account.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>Note</FormLabel>
                <Textarea {...register("note")} />
              </FormControl>
            </Stack>
          </DrawerBody>

          <DrawerFooter>
            <Button
              colorScheme="green"
              mr={3}
              leftIcon={<FiSave />}
              onClick={submit(handleSubmit)}
              isLoading={isCreating || isUpdating || isDeleting}
            >
              Save
            </Button>
            {getValues("id") && (
              <Button
                mr={3}
                leftIcon={<MdDeleteForever />}
                variant="outline"
                colorScheme="red"
                isLoading={isDeleting}
                onClick={handleDelete}
              >
                Delete
              </Button>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <CategoryForm
        isOpenForm={isOpenCategory}
        onToggleForm={toggleCategory}
        onSelected={handleSelectCategory}
      />

      <AccountForm
        isOpenForm={isOpenAccount}
        onToggleForm={toggleAccount}
        onSelected={handleSelectAccount}
      />
    </React.Fragment>
  );
};
