import { TypedDocumentNode, gql, useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Flex,
  FormControl,
  HStack,
  Icon,
  Input,
  Tag,
  TagCloseButton,
  TagLabel,
} from "@chakra-ui/react";
import React from "react";
import { FiPlus } from "react-icons/fi";
import { Account } from "../type";

const GET_ACCOUNTS: TypedDocumentNode<
  { accounts: Account[] },
  { createdById: number }
> = gql(`
  query GetAccounts($createdById: Int!){
    accounts(createdById: $createdById){
      id,
      name,
      createdById
    }
  }
`);

const CREATE_ACCOUNT: TypedDocumentNode<any, { input: any }> = gql`
  mutation CreateAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
      id
    }
  }
`;

const DELETE_CATEGORY: TypedDocumentNode<any, { id: any }> = gql`
  mutation DeleteAccount($id: Int!) {
    deleteAccount(id: $id) {
      id
    }
  }
`;

type Props = {
  isOpenForm: boolean;
  onSelected: (item: Account) => any;
  onToggleForm: () => void;
};
export const AccountForm = (props: Props) => {
  const { isOpenForm, onSelected, onToggleForm } = props;

  const [showCreate, setShowCreate] = React.useState(false);

  const { data = { accounts: [] } } = useQuery(GET_ACCOUNTS, {
    variables: { createdById: 1 },
  });

  const [name, setName] = React.useState("");

  const [createAccount, { loading }] = useMutation(CREATE_ACCOUNT, {
    refetchQueries: [GET_ACCOUNTS],
  });

  const [deleteAccount] = useMutation(DELETE_CATEGORY, {
    refetchQueries: [GET_ACCOUNTS],
  });

  const handleCreate = async () => {
    await createAccount({ variables: { input: { createdById: 1, name } } });
  };

  const handleCancel = () => setShowCreate(false);

  const handleDelete = async (id: number) => {
    await deleteAccount({ variables: { id } });
  };

  return (
    <Drawer
      placement="right"
      isOpen={isOpenForm}
      blockScrollOnMount={false}
      onClose={onToggleForm}
    >
      <DrawerContent overflow="scroll" style={{ top: "unset", height: 300 }}>
        <DrawerHeader borderTop="1px solid" borderColor="gray.200">
          <HStack>
            <div>Accounts</div>
            <Icon
              as={FiPlus}
              onClick={() => setShowCreate(!showCreate)}
              cursor="pointer"
            />
          </HStack>
        </DrawerHeader>
        <DrawerBody>
          <Flex gap={4} wrap="wrap">
            {showCreate && (
              <HStack>
                <FormControl>
                  <Input
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormControl>
                <Button
                  colorScheme="green"
                  isLoading={loading}
                  onClick={handleCreate}
                >
                  Save
                </Button>
                <Button onClick={handleCancel}>Cancel</Button>
              </HStack>
            )}
            {data.accounts.map((item) => (
              <Tag
                key={item.id}
                size="lg"
                variant="solid"
                colorScheme="green"
                cursor="pointer"
                onClick={onSelected(item)}
              >
                <TagLabel>{item.name}</TagLabel>
                <TagCloseButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                />
              </Tag>
            ))}
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
