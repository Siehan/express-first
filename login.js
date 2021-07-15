import { Button, Container, Box, Stack } from "@chakra-ui/react";
import { Text, Heading, useDisclosure } from "@chakra-ui/react";


import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

function Login({ title, desc, ...rest }) {
  const [web3State, login] = useContext(Web3Context);

  const { isOpen: isOpenLogoutModal, onOpen: onOpenLogoutModal, onClose: onCloseLogoutModal } = useDisclosure();


  const handleClickLogin = () => {
    if (!web3State.isLogged) {
      login();
    } else {
    }
  };

  return (
    <>
      <Modal isOpen={isOpenLogoutModal} onClose={onCloseLogoutModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Log out from a Dapp</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>You can not log out from a Dapp.</Text>
            <Text>If you want to log out of this website, do it directly from MetaMask.</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={onCloseLogoutModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
          <Box>
              <Button
                id="login"
                size="lg"
                bg="orange"
                onClick={() => (!web3State.isLogged ? handleClickLogin() : onOpenLogoutModal())}
              >
                {!web3State.isLogged ? (
                  "Log in to your account"
                ) : web3State.chainId === 4 ? (
                  web3State.account.split("").splice(0, 6).join("") +
                  "..." +
                  web3State.account.split("").splice(-4).join("")
                ) : (
                  <p style={{ color: "red" }}>WRONG NETWORK</p>
                )}
              </Button>
            </Box>
            <a
              href="https://">
            </a>
            </>
  );
}

export default Login;
*/
