import { Box, Flex, Input } from "@chakra-ui/react";
type Props = {
  searchDate: string;
  onSearchDateChange: (e: any) => void;
};
export const SearchBar = (props: Props) => {
  const { searchDate, onSearchDateChange } = props;
  return (
    <Flex justifyContent="flex-end">
      <Box>
        <Input
          bg="white"
          type="month"
          value={searchDate}
          onChange={onSearchDateChange}
        />
      </Box>
    </Flex>
  );
};
