export async function initGoogleCalendar() {
  return new Promise((resolve) => {
    const scriptId = 'gapi-js';
    if (document.getElementById(scriptId)) return resolve();
    const s = document.createElement('script');
    s.id = scriptId;
    s.src = 'https://apis.google.com/js/api.js';
    s.onload = () => resolve();
    document.body.appendChild(s);
  });
}

export async function signInToGoogle() {
  const apiKey = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY;
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const discoveryDocs = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
  const scope = 'https://www.googleapis.com/auth/calendar.events';

  // gapi global provided by api.js
  // eslint-disable-next-line no-undef
  const g = window.gapi;
  await new Promise((resolve) => g.load('client:auth2', resolve));
  await g.client.init({ apiKey, clientId, discoveryDocs, scope });
  const authInstance = g.auth2.getAuthInstance();
  if (!authInstance.isSignedIn.get()) {
    await authInstance.signIn();
  }
}

export async function insertCalendarEvent({ summary, description, start, end, timeZone }) {
  // eslint-disable-next-line no-undef
  const g = window.gapi;
  return g.client.calendar.events.insert({
    calendarId: 'primary',
    resource: { summary, description, start: { dateTime: start, timeZone }, end: { dateTime: end, timeZone } },
  });
}


