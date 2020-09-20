const { token } = require('gen-uid');

function handleAsyncError(fn) {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      console.error(err.message);
      if (err.statusCode) {
        res.status(err.statusCode).send(err.message);
      } else {
        res.status(500).send(err.message);
      }
    }
  };
}

function logRequestsAndResponses(req, res, next) {
  if (req.originalUrl !== '/status') {
    req.requestId = token(true).substr(0, 8);
    const reqStartTime = Date.now();
    const datetime = new Date();

    console.info({
      reqId: req.requestId,
      datetime,
      method: req.method,
      url: req.originalUrl
    });
    res.on('finish', () => {
      const reqEndTime = Date.now();
      const responseTime = reqEndTime - reqStartTime;
      console.info({
        reqId: req.requestId,
        responseTimeMs: responseTime,
        status: res.statusCode,
        message: res.statusMessage,
        'Content-Length': res.get('Content-Length')
      });
    });
  }

  next();
}

function _parseBodyAndCheckContentType(req, res, next, rawBody) {
  if (rawBody && rawBody.length) {
    if (req.headers['content-type'] === 'application/json') {
      try {
        req.body = JSON.parse(rawBody);
        next();
      } catch (err) {
        res.status(400).send('request had malformed JSON body');
      }
    } else {
      res.status(400).send('running orders service only accepts data of "content-type: application/json"');
    }
  } else {
    req.body = {};
    next();
  }
}

function parseBodyAndCheckContentType(req, res, next) {
  let rawBody = '';
  req.setEncoding('utf8');
  req.on('data', (chunk) => {
    rawBody += chunk;
  });
  req.on('end', () => {
    _parseBodyAndCheckContentType(req, res, next, rawBody);
  });
}

module.exports = {
  handleAsyncError,
  logRequestsAndResponses,
  parseBodyAndCheckContentType,
  _parseBodyAndCheckContentType
};
