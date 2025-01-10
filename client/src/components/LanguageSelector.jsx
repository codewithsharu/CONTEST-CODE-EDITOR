import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { LANGUAGE_VERSIONS } from "../constants";

const languages = Object.entries(LANGUAGE_VERSIONS);

const LanguageSelector = ({ language, onSelect }) => {
  return (
    <Box mb={4}>
      <Text mb={2} fontSize="lg" color="white">
        Language
      </Text>
      <Menu>
        <MenuButton 
          as={Button} 
          width="150px"
          bg="gray.700"
          color="white"
          _hover={{ bg: "gray.600" }}
        >
          {language}
        </MenuButton>
        <MenuList bg="gray.800" borderColor="gray.600">
          {languages.map(([lang, version]) => (
            <MenuItem
              key={lang}
              onClick={() => onSelect(lang)}
              bg={lang === language ? "gray.700" : "transparent"}
              color="white"
              _hover={{ bg: "gray.600" }}
            >
              {lang} ({version})
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
};

export default LanguageSelector;
