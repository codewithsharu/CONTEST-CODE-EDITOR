import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
} from "@chakra-ui/react";
import { getProblems } from "../../api";

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await getProblems();
        setProblems(data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading) return <Text color="white">Loading...</Text>;

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