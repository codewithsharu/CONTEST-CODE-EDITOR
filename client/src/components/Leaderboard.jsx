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
} from "@chakra-ui/react";
import { getLeaderboard } from "../api";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getLeaderboard();
        console.log('Leaderboard response:', response); // Debug log
        setLeaderboard(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setError(error.message || 'Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
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
    <Container maxW="container.lg">
      <Text fontSize="2xl" color="white" mb={6}>
        Leaderboard
      </Text>
      {leaderboard.length === 0 ? (
        <Text color="gray.300" textAlign="center">No submissions yet</Text>
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