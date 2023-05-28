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
  VStack,
} from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import { Category } from "../type";
import React from "react";

const GET_CATEGORIES: TypedDocumentNode<
  { categories: Category[] },
  { createdById: number }
> = gql(`
  query GetCategories($createdById: Int!){
    categories(createdById: $createdById){
      id,
      name,
      createdById
    }
  }
`);

const CREATE_CATEGORY: TypedDocumentNode<any, { input: any }> = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
    }
  }
`;

const DELETE_CATEGORY: TypedDocumentNode<any, { id: any }> = gql`
  mutation CreateCategory($id: Int!) {
    deleteCategory(id: $id) {
      id
    }
  }
`;

type Props = {
  isOpenForm: boolean;
  onSelected: (item: Category) => any;
  onToggleForm: () => void;
};
export const CategoryForm = (props: Props) => {
  const { isOpenForm, onSelected, onToggleForm } = props;

  const [showCreate, setShowCreate] = React.useState(false);

  const { data = { categories: [] } } = useQuery(GET_CATEGORIES, {
    variables: { createdById: 1 },
  });

  const [name, setName] = React.useState("");

  const [createCategory, { loading }] = useMutation(CREATE_CATEGORY, {
    refetchQueries: [GET_CATEGORIES],
  });

  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    refetchQueries: [GET_CATEGORIES],
  });

  const handleCreate = async () => {
    await createCategory({ variables: { input: { createdById: 1, name } } });
  };

  const handleCancel = () => setShowCreate(false);

  const handleDelete = async (id: number) => {
    await deleteCategory({ variables: { id } });
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
            <div>Categories</div>
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
            {data.categories.map((item) => (
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
