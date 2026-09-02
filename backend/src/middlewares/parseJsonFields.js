// O SQLite não tem um tipo de lista nativo: os campos "specialties" (Barber) e
// "benefits" (Plan) são salvos como texto JSON no banco. Este middleware
// percorre toda resposta da API e converte esses campos de volta para arrays
// de verdade, não importa o quão aninhados estejam (ex.: agendamento -> barbeiro
// -> specialties, ou assinatura -> plano -> benefits).
const JSON_FIELDS = new Set(['specialties', 'benefits']);

function deepParse(value) {
  if (Array.isArray(value)) {
    return value.map(deepParse);
  }
  if (value instanceof Date) {
    return value;
  }
  if (value && typeof value === 'object') {
    const result = {};
    for (const [key, val] of Object.entries(value)) {
      if (JSON_FIELDS.has(key) && typeof val === 'string') {
        try {
          result[key] = JSON.parse(val);
          continue;
        } catch {
          // valor não é um JSON válido; mantém como veio
        }
      }
      result[key] = deepParse(val);
    }
    return result;
  }
  return value;
}

export function parseJsonFields(_req, res, next) {
  const originalJson = res.json.bind(res);
  res.json = (body) => originalJson(deepParse(body));
  next();
}
