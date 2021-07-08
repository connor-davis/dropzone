let { Router } = require('express');
let router = Router();

router.get('/', async (request, response) => {
  return response.status(200).json({ self: request.self });
});

module.exports = router;
