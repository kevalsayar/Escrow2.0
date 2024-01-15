class ApiResponse {
  constructor(code, message, data) {
    this.code = code; 
    this.status = true;
    this.message = message; 
    this.data = data; 
  }
}

module.exports = { ApiResponse };
