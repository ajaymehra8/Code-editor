class AppError extends Error {
    public code: number;
    public isOperational: boolean;
  
    constructor(code: number, message: string) {
      super(message); // Call the parent class constructor
      this.code = code;
      this.isOperational = true;
  
      Object.setPrototypeOf(this, AppError.prototype); // Ensure proper prototype chain
    }
  }
  
  export default AppError;
  