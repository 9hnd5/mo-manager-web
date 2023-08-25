import { Button, ButtonProps } from "@chakra-ui/react";
type Props = ButtonProps;
export const FloatingButton = (props: Props) => {
  const { children, ...restProps } = props;
  return (
    <Button
      {...restProps}
      position="fixed"
      bottom={4}
      right={4}
      borderRadius="full"
      size="lg"
      colorScheme="green"
      zIndex="999"
      boxShadow="lg"
    >
      {children}
    </Button>
  );
};
