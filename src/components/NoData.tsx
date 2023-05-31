import { Box, Text } from "@chakra-ui/react";

export const NoData = () => {
  return (
    <Box p={4} bg="gray.200" borderRadius="md">
      <Text fontSize="md" fontWeight="bold" textAlign="center">
        No data available
      </Text>
    </Box>
  );
};
