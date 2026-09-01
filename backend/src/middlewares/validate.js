// Valida body/params/query com Zod e substitui os dados da requisição
// pelas versões parseadas (com defaults e coerções aplicados).
export function validate(schemas) {
  return (req, _res, next) => {
    if (schemas.body) {
      req.body = schemas.body.parse(req.body);
    }
    if (schemas.params) {
      req.params = schemas.params.parse(req.params);
    }
    if (schemas.query) {
      req.query = schemas.query.parse(req.query);
    }
    next();
  };
}
