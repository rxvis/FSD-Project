const sendError = (res, status, message) => {
  res.status(status).json({ message });
};

export { sendError };
