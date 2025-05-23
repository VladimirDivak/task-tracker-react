declare global {
  namespace Express {
    interface Request {
      user?: { id: string }; // Or whatever structure your JWT payload's user object has
    }
  }
}

// Adding this export {} line to make it a module, which can help with global scope.
export {};
