const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class CodeExecutionService {
  constructor() {
    this.tempDir = path.join(__dirname, '../temp');
  }

  async initialize() {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      console.error('Error creating temp directory:', error);
    }
  }

  async executeCode(language, code, input) {
    const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const inputFile = path.join(this.tempDir, `${fileName}.txt`);
    
    try {
      // Write input to file
      await fs.writeFile(inputFile, input);

      switch (language.toLowerCase()) {
        case 'python':
          return await this.executePython(code, inputFile, fileName);
        case 'java':
          return await this.executeJava(code, inputFile, fileName);
        case 'cpp':
          return await this.executeCpp(code, inputFile, fileName);
        default:
          throw new Error('Unsupported language');
      }
    } finally {
      // Cleanup
      await this.cleanup(fileName);
    }
  }

  async executePython(code, inputFile, fileName) {
    const sourceFile = path.join(this.tempDir, `${fileName}.py`);
    await fs.writeFile(sourceFile, code);
    
    return new Promise((resolve, reject) => {
      exec(
        `python "${sourceFile}" < "${inputFile}"`,
        { timeout: 5000 }, // 5 second timeout
        (error, stdout, stderr) => {
          if (error && error.killed) {
            reject(new Error('Time Limit Exceeded'));
          } else if (error) {
            reject(new Error(stderr));
          } else {
            resolve({ output: stdout });
          }
        }
      );
    });
  }

  // Add similar methods for Java and C++
  // ... 

  async cleanup(fileName) {
    try {
      const files = await fs.readdir(this.tempDir);
      const filesToDelete = files.filter(file => file.startsWith(fileName));
      await Promise.all(
        filesToDelete.map(file => fs.unlink(path.join(this.tempDir, file)))
      );
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
}

module.exports = new CodeExecutionService(); 