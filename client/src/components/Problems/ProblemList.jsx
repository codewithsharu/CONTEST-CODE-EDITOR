import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
  Container,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { getProblems } from "../../api";

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProblems = async () => {
      try {
        setLoading(true);
        const response = await getProblems();
        setProblems(response.data);
      } catch (error) {
        console.error("Error fetching problems:", error);
        setError(error.response?.data?.message || "Failed to load problems");
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="50vh">
        <Spinner size="xl" color="blue.500" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error" mt={10}>
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Container maxW="container.xl">
      <Text fontSize="2xl" color="white" mb={6}>
        Problems
      </Text>
      <Box bg="gray.800" borderRadius="md" overflow="hidden">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th color="gray.400">Title</Th>
              <Th color="gray.400">Difficulty</Th>
              <Th color="gray.400">Solved</Th>
            </Tr>
          </Thead>
          <Tbody>
            {problems.map((problem) => (
              <Tr key={problem._id} _hover={{ bg: "gray.700" }}>
                <Td>
                  <Link to={`/problem/${problem._id}`}>
                    <Text color="blue.400" _hover={{ color: "blue.300" }}>
                      {problem.title}
                    </Text>
                  </Link>
                </Td>
                <Td>
                  <Badge
                    colorScheme={
                      problem.difficulty === "Easy"
                        ? "green"
                        : problem.difficulty === "Medium"
                        ? "yellow"
                        : "red"
                    }
                  >
                    {problem.difficulty}
                  </Badge>
                </Td>
                <Td color="gray.400">{problem.solvedCount || 0}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Container>
  );
};

export default ProblemList; 