// Envolve controllers assíncronos para encaminhar erros ao middleware
// centralizado de tratamento de erros, evitando try/catch repetido.
export function asyncHandler(handler) {
  return (req, res, next) => {
    handler(req, res, next).catch(next);
  };
}
