const test = require('node:test');
const assert = require('node:assert/strict');
const { validateLocalNames } = require('../globals/helpers/food_local_names');

const countrywide = { country_id: 1, scope: 'countrywide', name: 'Mahindi' };
test('zero, one, and multiple names across countries and communities', () => {
  assert.deepEqual(validateLocalNames(), []);
  assert.deepEqual(validateLocalNames([]), []);
  assert.equal(validateLocalNames([countrywide]).length, 1);
  const names = validateLocalNames([
    countrywide,
    { country_id: 1, scope: 'tribal', tribe_name: ' Example tribe ', name: ' Example name ' },
    { country_id: 2, scope: 'official_language', language_name: ' Kiswahili ', name: 'Mahindi' },
  ]);
  assert.equal(names.length, 3);
  assert.equal(names[1].tribe_name, 'Example tribe');
  assert.equal(names[1].name, 'Example name');
  assert.equal(names[2].language_name, 'Kiswahili');
});

test('rejects malformed payloads before persistence', () => {
  for (const value of [null, {}, 'name', [null], [[]], [1]]) {
    assert.throws(() => validateLocalNames(value));
  }
  for (const patch of [
    { country_id: 0 }, { country_id: '1' }, { country_id: 1.2 },
    { name: '' }, { name: '   ' }, { name: 123 }, { name: 'a'.repeat(256) },
    { scope: 'unknown' }, { scope: 'tribal' }, { scope: 'official_language' },
    { tribe_name: 'Unexpected tribe' }, { language_name: 'Unexpected language' },
    { scope: 'tribal', tribe_name: 'a'.repeat(101) },
  ]) assert.throws(() => validateLocalNames([{ ...countrywide, ...patch }]));
});

test('rejects duplicate names, but allows the same name in different contexts', () => {
  assert.throws(() => validateLocalNames([countrywide, { ...countrywide, name: ' MAHINDI ' }]), /duplicate/);
  assert.equal(validateLocalNames([countrywide, { ...countrywide, country_id: 2 }]).length, 2);
  assert.equal(validateLocalNames([countrywide, { ...countrywide, scope: 'official_language', language_name: 'Kiswahili' }]).length, 2);
});


test('keeps each pronunciation with its name and rejects invalid audio', () => {
  const audio = 'data:audio/webm;codecs=opus;base64,YWJj';
  const names = validateLocalNames([{ ...countrywide, pronunciation_audio: audio }, { ...countrywide, country_id: 2 }]);
  assert.equal(names[0].pronunciation_audio, audio);
  assert.equal(names[1].pronunciation_audio, undefined);
  for (const pronunciation_audio of [null, 1, '', 'https://example.com/audio', 'data:image/png;base64,YWJj']) {
    assert.throws(() => validateLocalNames([{ ...countrywide, pronunciation_audio }]), /recording/);
  }
  assert.throws(() => validateLocalNames([{ ...countrywide, pronunciation_audio: audio }, countrywide]), /duplicate/);
});
