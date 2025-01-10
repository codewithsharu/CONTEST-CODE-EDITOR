import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Flex,
  Button,
  Link,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";

const Navbar = () => {
  const isAuthenticated = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <Box bg="gray.800" px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <HStack spacing={8} alignItems="center">
          <Link
            as={RouterLink}
            to="/"
            fontSize="xl"
            fontWeight="bold"
            color="white"
            _hover={{ textDecoration: "none", color: "gray.300" }}
          >
            Code Contest
          </Link>
          <HStack spacing={4}>
            <Link
              as={RouterLink}
              to="/"
              color="gray.300"
              _hover={{ color: "white" }}
            >
              Problems
            </Link>
            <Link
              as={RouterLink}
              to="/playground"
              color="gray.300"
              _hover={{ color: "white" }}
            >
              Playground
            </Link>
            <Link
              as={RouterLink}
              to="/leaderboard"
              color="gray.300"
              _hover={{ color: "white" }}
            >
              Leaderboard
            </Link>
          </HStack>
        </HStack>

        <HStack>
          {isAuthenticated ? (
            <Button
              colorScheme="red"
              variant="solid"
              size="sm"
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <>
              <Button
                as={RouterLink}
                to="/login"
                colorScheme="blue"
                variant="solid"
                size="sm"
              >
                Login
              </Button>
              <Button
                as={RouterLink}
                to="/register"
                colorScheme="green"
                variant="solid"
                size="sm"
              >
                Register
              </Button>
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar; 