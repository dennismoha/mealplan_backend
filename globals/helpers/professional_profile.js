const BadRequest = require('../../middlewares/custom_errors/bad_request');
const fields = ['first_name', 'last_name', 'jobs', 'bio', 'image_url'];
function profileData(body, required = false) {
  const data = {};
  for (const [key, max] of [['first_name', 100], ['last_name', 100], ['bio', 5000], ['image_url', 2000]]) {
    if (body[key] === undefined && !required) continue;
    if (typeof body[key] !== 'string' || body[key].trim().length > max || (required && !body[key].trim())) throw new BadRequest(`Enter a valid ${key.replace(/_/g, ' ')}`);
    data[key] = body[key].trim() || null;
  }
  if (data.image_url) {
    let url;
    try { url = new URL(data.image_url); } catch { throw new BadRequest('Image URL must use HTTP or HTTPS'); }
    if (!['https:', 'http:'].includes(url.protocol)) throw new BadRequest('Image URL must use HTTP or HTTPS');
  }
  if (body.jobs !== undefined || required) {
    if (!Array.isArray(body.jobs) || body.jobs.length > 20 || body.jobs.some(job => typeof job !== 'string' || !job.trim() || job.trim().length > 100) || (required && !body.jobs.length)) throw new BadRequest('Enter between 1 and 20 professional jobs');
    data.jobs = [...new Set(body.jobs.map(job => job.trim()))];
  }
  return data;
}
const profileView = user => ({ id: user.idusers, first_name: user.first_name, last_name: user.last_name, jobs: user.jobs || [], bio: user.bio, image_url: user.image_url });
module.exports = { profileData, profileView, fields };
