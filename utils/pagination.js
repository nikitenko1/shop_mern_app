const Pagination = (req, defaultLimit = 8) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || defaultLimit;
  const skip = (page - 1) * limit;
  return { page, skip, limit };
};

module.exports = Pagination;
