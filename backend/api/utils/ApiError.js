class ApiError extends Error {
  constructor(
    code = 500, 
    message = "Server encountered an unexpected condition that prevented it from fulfilling the request!", 
    data = null 
  ) {
    super(message)
    this.code = code;
    this.status = false; 
    this.data = data;
    this.message = message; 
  }
}

module.exports = { ApiError };
