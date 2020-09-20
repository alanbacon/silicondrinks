const errorDefinitions = [
  {
    name: 'NotFound',
    code: 404
  },
  {
    name: 'BadRequest',
    code: 400
  }
];

function ErrorTypeFactory(errorName, statusCode) {
  return class extends Error {
    constructor(...args) {
      super(...args);
      this.name = errorName;
      this.statusCode = statusCode;
      Error.captureStackTrace(this, typeof this);
    }
  };
}

for (const errDef of errorDefinitions) {
  const { name, code } = errDef;
  exports[name] = ErrorTypeFactory(name, code);
}
