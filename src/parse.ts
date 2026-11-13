// the SDK uses Node's EventEmitter: package.json adds the `events` package,
// without it Vite fails with "Emitter is not a constructor"
import Parse from 'parse';

const env = import.meta.env;

if (!env.VITE_PARSE_APP_ID || !env.VITE_PARSE_SERVER_URL) {
  throw new Error('Copy .env.example to .env and fill in your keys from App Settings › Security & Keys.');
}

// the Application ID and JavaScript Key are public: ACLs and class-level
// permissions protect the data, never put the master key in a web app
Parse.initialize(env.VITE_PARSE_APP_ID, env.VITE_PARSE_JS_KEY);
Parse.serverURL = env.VITE_PARSE_SERVER_URL;
if (env.VITE_PARSE_LIVE_QUERY_URL) {
  Parse.liveQueryServerURL = env.VITE_PARSE_LIVE_QUERY_URL;
}

export const liveQueriesEnabled = Boolean(env.VITE_PARSE_LIVE_QUERY_URL);
export default Parse;
