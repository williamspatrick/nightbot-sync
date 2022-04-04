module.exports = {
    testEnvironment: "node",
    modulePathIgnorePatterns: ["<rootDir>/src/"],
    moduleNameMapper: {
        "^@/(.*)": "<rootDir>/build/$1",
    },
};
