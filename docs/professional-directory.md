# Professional profiles and meal plans

The public **Professionals** navigation link opens `/professionals`. The directory includes active professional accounts with at least one owned meal plan, including plans whose days are still being prepared. Revoked accounts and professionals without plans are excluded. Each card opens `/professionals/:id`, where the existing meal planner shows only that professional's plans and their descriptions. This view is public and does not switch to the signed-in visitor's plans.

The protected `/professional` route remains the professional's editing dashboard. **Edit professional profile** allows them to set their first name, last name, multiple professional jobs (comma-separated), biography, and HTTP(S) image URL. Administrators can enter these fields when creating a professional or use **Edit profile** in People & access. Public API responses contain only profile fields and plan information, excluding email and authentication fields.

Professional-created meal plans require a description of at least 10 characters. Owners and administrators can use **Edit description** below the planner to update existing descriptions. The backend also enforces this requirement when updating professional-owned plans. Existing missing biographies and descriptions are displayed as missing; no personal details or descriptions are invented.

Migration `015_professional_profiles` adds nullable fields to users, preserving existing accounts. Existing professionals should fill in their profiles and missing plan descriptions.

API routes:

- `GET /user/professionals`: public directory with plan counts.
- `GET /user/professionals/:id`: public profile and owner-filtered plans; unavailable professionals return 404.
- `GET /user/professionals/me`: authenticated professional's own profile.
- `PUT /user/professionals/me`: update own profile, restricted to professionals.
- Existing administrator user create/update endpoints accept `first_name`, `last_name`, `jobs` (array of strings), `bio`, and `image_url`.
- `PUT /api/meal/meal-plan/time-intervals/:id` supports description-only updates with the existing ownership checks.

Checks: `node --test scripts/professional_profiles.test.js`, `npm run build --prefix frontend`, and `node scripts/check_professionals_db.js` (local database integration check with rolled-back fixtures).
