import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Grid, Text, VStack } from "@chakra-ui/react";
import CodeEditor from "../CodeEditor";
import { getProblem } from "../../api";

const ProblemDetail = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const data = await getProblem(id);
        setProblem(data);
      } catch (error) {
        console.error("Error fetching problem:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  if (loading) return <Text color="white">Loading...</Text>;
  if (!problem) return <Text color="white">Problem not found</Text>;

  return (
    <Grid templateColumns="300px 1fr" gap={6}>
      <VStack align="stretch" spacing={4}>
        <Box bg="gray.800" p={4} borderRadius="md">
          <Text fontSize="xl" color="white" mb={2}>
            {problem.title}
          </Text>
          <Text color="gray.400" mb={4}>
            Difficulty: {problem.difficulty}
          </Text>
          <Text color="gray.300" whiteSpace="pre-wrap">
            {problem.description}
          </Text>
        </Box>
        
        <Box bg="gray.800" p={4} borderRadius="md">
          <Text color="white" mb={2}>Sample Input:</Text>
          <Text color="gray.300" whiteSpace="pre">{problem.sampleInput}</Text>
          
          <Text color="white" mt={4} mb={2}>Sample Output:</Text>
          <Text color="gray.300" whiteSpace="pre">{problem.sampleOutput}</Text>
        </Box>
      </VStack>

      <Box>
        <CodeEditor problem={problem} />
      </Box>
    </Grid>
  );
};

export default ProblemDetail; 