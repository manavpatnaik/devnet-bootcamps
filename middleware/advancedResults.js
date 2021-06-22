const advancedResults = (model, populate) => async (req, res, next) => {
  let reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over the fields and remove from req.query
  removeFields.forEach((field) => delete reqQuery[field]);

  // Create query string and insert $ operator
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(
    /\b(gt|gte|lte|lt|in)\b/g,
    (match) => `$${match}`
  );

  // Finding resource
  let query = model.find(JSON.parse(queryStr));

  // Select fields
  if (req.query.select) {
    const selectFields = req.query.select.split(',').join(' ');
    query.select(selectFields);
  }

  // Sort fields
  if (req.query.sort) {
    const sortFields = req.query.sort.split(',').join(' ');
    query.sort(sortFields);
  } else {
    query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  // Executing query
  const results = await query;

  // Pagination result
  const pagination = {
    totalPages: Math.ceil(total / limit),
  };

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };
  next();
};

module.exports = advancedResults;
