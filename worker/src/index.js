// Meta Conversions API relay for prettywoman-termine.velonify.de
// Receives events from the LP (only after cookie consent), adds IP + user agent, forwards to Meta.

const EVENTS = new Set(['PageView', 'ViewContent', 'TerminGebucht']);
const GRAPH = 'https://graph.facebook.com/v21.0';

function cors(env) {
  return {
    'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

const str = (v, max) => (typeof v === 'string' && v.length <= max ? v : undefined);

export default {
  async fetch(request, env, ctx) {
    const h = cors(env);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: h });
    if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers: h });
    if (request.headers.get('Origin') !== env.ALLOWED_ORIGIN) return new Response('Forbidden', { status: 403, headers: h });

    let b;
    try { b = JSON.parse(await request.text()); } catch { return new Response('Bad Request', { status: 400, headers: h }); }

    const name = str(b.event_name, 40);
    const eventId = str(b.event_id, 80);
    const url = str(b.event_source_url, 500);
    if (!EVENTS.has(name) || !eventId || !url || !url.startsWith(env.ALLOWED_ORIGIN)) {
      return new Response('Bad Request', { status: 400, headers: h });
    }

    const custom = {};
    if (b.custom_data && typeof b.custom_data === 'object') {
      for (const [k, v] of Object.entries(b.custom_data).slice(0, 10)) {
        if (typeof v === 'string' || typeof v === 'number') custom[String(k).slice(0, 40)] = typeof v === 'string' ? v.slice(0, 200) : v;
      }
    }

    const userData = {
      client_ip_address: request.headers.get('CF-Connecting-IP') || undefined,
      client_user_agent: request.headers.get('User-Agent') || undefined,
      fbp: str(b.fbp, 120),
      fbc: str(b.fbc, 200),
    };

    const payload = {
      data: [{
        event_name: name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: 'website',
        event_source_url: url,
        user_data: userData,
        custom_data: Object.keys(custom).length ? custom : undefined,
      }],
    };
    if (env.TEST_EVENT_CODE) payload.test_event_code = env.TEST_EVENT_CODE;

    const res = await fetch(`${GRAPH}/${env.PIXEL_ID}/events?access_token=${encodeURIComponent(env.META_CAPI_TOKEN)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    if (!res.ok) console.log('Meta error', res.status, text.slice(0, 500));
    return new Response(res.ok ? 'ok' : 'upstream error', { status: res.ok ? 200 : 502, headers: h });
  },
};
