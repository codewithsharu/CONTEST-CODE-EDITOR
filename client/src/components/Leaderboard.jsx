import { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Container,
  Spinner,
  Alert,
  AlertIcon,
  Button,
} from "@chakra-ui/react";
import { getLeaderboard, submitSolution } from "../api";
import api from "../api";
import { useNavigate } from "react-router-dom";

const Leaderboard = () => {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const createTestData = async () => {
    try {
      setLoading(true);
      const problemResponse = await api.post('/problems/test-problem');

      await submitSolution(
        problemResponse.data._id,
        'function twoSum(nums, target) { return [0,1]; }',
        'javascript'
      );

      const response = await getLeaderboard();
      setLeaderboard(response.data);
    } catch (error) {
      console.error("Error creating test data:", error);
      setError(error.response?.data?.message || 'Failed to create test data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await getLeaderboard();
        setLeaderboard(response.data);
      } catch (error) {
        console.error("Error details:", error);
        if (error.response?.status === 401) {
          navigate("/login");
        } else {
          setError(error.response?.data?.message || 'Failed to load leaderboard');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
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
    <Container maxW="container.lg" py={8}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
        <Text fontSize="2xl" color="white">
          Leaderboard
        </Text>
        <Button colorScheme="blue" onClick={createTestData}>
          Create Test Data
        </Button>
      </Box>
      {leaderboard.length === 0 ? (
        <Box textAlign="center" p={8} bg="gray.800" borderRadius="md">
          <Text color="gray.300">No submissions yet</Text>
        </Box>
      ) : (
        <Box bg="gray.800" borderRadius="md" overflow="hidden">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th color="gray.400">Rank</Th>
                <Th color="gray.400">Username</Th>
                <Th color="gray.400" isNumeric>Problems Solved</Th>
                <Th color="gray.400" isNumeric>Total Time</Th>
              </Tr>
            </Thead>
            <Tbody>
              {leaderboard.map((user, index) => (
                <Tr key={index} _hover={{ bg: "gray.700" }}>
                  <Td color="gray.300">{index + 1}</Td>
                  <Td color="gray.300">{user.username}</Td>
                  <Td color="gray.300" isNumeric>{user.problemsSolved}</Td>
                  <Td color="gray.300" isNumeric>
                    {(user.totalTime / 1000).toFixed(2)}s
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Container>
  );
};

export default Leaderboard; 