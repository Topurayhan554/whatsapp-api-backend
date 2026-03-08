// Success response
const successResponse = (res, statusCode = 200, message, data = null) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

// Error response
const errorResponse = (res, statusCode = 500, message) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = { successResponse, errorResponse };
