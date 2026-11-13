// Creates the Todo class with its fields and permissions. Run it once with
// the master key, from your machine (never from the app):
//   PARSE_SERVER_URL=https://pg-app-xxxxxxxx.scalabl.cloud/1 PARSE_APP_ID=... PARSE_MASTER_KEY=... node scripts/setup-schema.mjs
const { PARSE_SERVER_URL, PARSE_APP_ID, PARSE_MASTER_KEY } = process.env;
if (!PARSE_SERVER_URL || !PARSE_APP_ID || !PARSE_MASTER_KEY) {
  console.error('Set PARSE_SERVER_URL, PARSE_APP_ID and PARSE_MASTER_KEY (App Settings › Security & Keys).');
  process.exit(1);
}

const loggedIn = { requiresAuthentication: true };
const schema = {
  className: 'Todo',
  fields: {
    // validated in cloud/main.js, which works on every Parse Server version
    title: { type: 'String' },
    done: { type: 'Boolean' },
    owner: { type: 'Pointer', targetClass: '_User' },
  },
  // logged-in users only; each todo's ACL (set in cloud/main.js) limits it to its owner
  classLevelPermissions: {
    find: loggedIn, get: loggedIn, count: loggedIn,
    create: loggedIn, update: loggedIn, delete: loggedIn,
    addField: {},
  },
};

const base = PARSE_SERVER_URL.replace(/\/$/, '');
const headers = { 'X-Parse-Application-Id': PARSE_APP_ID, 'X-Parse-Master-Key': PARSE_MASTER_KEY, 'Content-Type': 'application/json' };
const exists = (await fetch(`${base}/schemas/Todo`, { headers })).ok;
const res = await fetch(`${base}/schemas/Todo`, { method: exists ? 'PUT' : 'POST', headers, body: JSON.stringify(exists ? { classLevelPermissions: schema.classLevelPermissions } : schema) });
const body = await res.json();
if (!res.ok) {
  console.error('Failed:', body.error || body);
  process.exit(1);
}
console.log(exists ? 'Updated the Todo class permissions.' : 'Created the Todo class.');
