// Keep validation independent of persistence so invalid entries never partially save.
function validateLocalNames(value = []) {
  if (!Array.isArray(value)) throw new Error('Local names must be an array');
  const seen = new Set();
  return value.map((entry, index) => {
    const fail = message => { throw new Error(`Local name ${index + 1}: ${message}`); };
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) fail('must be an object');
    const read = (key, max) => {
      if (entry[key] === undefined || entry[key] === null) return '';
      if (typeof entry[key] !== 'string') fail(`${key} must be text`);
      const text = entry[key].trim();
      if (text.length > max) fail(`${key} must be at most ${max} characters`);
      return text;
    };
    const name = read('name', 255);
    const tribe_name = read('tribe_name', 100);
    const language_name = read('language_name', 100);
    const { country_id, scope } = entry;
    if (!name) fail('name is required');
    if (!Number.isSafeInteger(country_id) || country_id <= 0) fail('country_id must be a positive integer');
    if (!['countrywide', 'tribal', 'official_language'].includes(scope)) fail('choose countrywide, tribal, or official_language');
    if (scope === 'tribal' && !tribe_name) fail('tribe name is required');
    if (scope === 'official_language' && !language_name) fail('language name is required');
    if (scope !== 'tribal' && tribe_name) fail('tribe name only applies to tribal names');
    if (scope !== 'official_language' && language_name) fail('language name only applies to official-language names');
    const result = { country_id, scope, name, tribe_name, language_name };
    const key = JSON.stringify(result).normalize('NFKC').toLocaleLowerCase('en');
    if (seen.has(key)) fail('duplicate entry');
    seen.add(key);
    if (entry.pronunciation_audio !== undefined) {
      if (typeof entry.pronunciation_audio !== 'string' || !/^data:audio\/[a-z0-9.+-]+(?:;[^,;=]+=[^,;]+)*;base64,[a-z0-9+/=\s]+$/i.test(entry.pronunciation_audio)) fail('invalid pronunciation recording');
      result.pronunciation_audio = entry.pronunciation_audio;
    }
    return result;
  });
}

module.exports = { validateLocalNames };
