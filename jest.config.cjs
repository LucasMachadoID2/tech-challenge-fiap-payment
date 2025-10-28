// jest.config.js
module.exports = {
  // Define o 'preset' que o Jest usará. ts-jest cuida da transpilação.
  preset: "ts-jest",

  // Define o ambiente de teste. 'node' simula um ambiente Node.js.
  testEnvironment: "node",

  // Onde o Jest deve procurar pelos arquivos de código-fonte (e testes).
  // '<rootDir>' é uma variável especial do Jest que aponta para a raiz do projeto.
  roots: ["<rootDir>/src"],

  transformIgnorePatterns: ["/node_modules/(?!uuid)"],

  // Padrão que o Jest usa para detectar arquivos de teste.
  // Padrão: qualquer arquivo .js, .jsx, .ts, .tsx dentro de uma pasta __tests__
  // ou arquivos com sufixo .test ou .spec
  testMatch: ["**/__tests__/**/*.+(ts|tsx|js)", "**/?(*.)+(spec|test).+(ts|tsx|js)"],

  // Transformações que o Jest deve aplicar
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
