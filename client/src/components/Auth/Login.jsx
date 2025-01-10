import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { login } from "../../api";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await login(formData);
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Login failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8}>
      <Box bg="gray.800" p={8} borderRadius="md" boxShadow="lg">
        <Text fontSize="2xl" color="white" mb={6} textAlign="center">
          Login
        </Text>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel color="gray.300">Email</FormLabel>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                bg="gray.700"
                color="white"
                borderColor="gray.600"
              />
            </FormControl>
            <FormControl>
              <FormLabel color="gray.300">Password</FormLabel>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                bg="gray.700"
                color="white"
                borderColor="gray.600"
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={isLoading}
            >
              Login
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default Login; 