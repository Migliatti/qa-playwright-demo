import { test, expect, APIRequestContext } from '@playwright/test';
import { newBooking, adminCredentials } from '../../fixtures/booking';

const BASE = 'https://restful-booker.herokuapp.com';
const JSON_HEADERS = { 'Content-Type': 'application/json', Accept: 'application/json' };

async function getToken(request: APIRequestContext): Promise<string> {
  const res = await request.post(`${BASE}/auth`, { data: adminCredentials, headers: JSON_HEADERS });
  expect(res.status()).toBe(200);
  return (await res.json()).token;
}

async function createBooking(request: APIRequestContext, data = newBooking()) {
  const res = await request.post(`${BASE}/booking`, { data, headers: JSON_HEADERS });
  expect(res.status()).toBe(200);
  return (await res.json()) as { bookingid: number; booking: ReturnType<typeof newBooking> };
}

test.describe('restful-booker API', () => {
  test('health check responds 201', async ({ request }) => {
    const res = await request.get(`${BASE}/ping`);
    expect(res.status()).toBe(201);
  });

  test('auth with valid credentials returns a token', async ({ request }) => {
    expect(await getToken(request)).toMatch(/^[a-z0-9]+$/);
  });

  test('auth with a wrong password does not return a token', async ({ request }) => {
    const res = await request.post(`${BASE}/auth`, {
      data: { ...adminCredentials, password: 'wrong' },
      headers: JSON_HEADERS,
    });
    // This API answers 200 with a reason instead of 401. Documented in the README.
    const body = await res.json();
    expect(body.token).toBeUndefined();
    expect(body.reason).toBe('Bad credentials');
  });

  test('create booking returns the id and the sent data', async ({ request }) => {
    const data = newBooking();
    const created = await createBooking(request, data);
    expect(created.bookingid).toBeGreaterThan(0);
    expect(created.booking).toMatchObject(data);
  });

  test('read booking returns what was created', async ({ request }) => {
    const data = newBooking({ firstname: 'Joao' });
    const { bookingid } = await createBooking(request, data);
    const res = await request.get(`${BASE}/booking/${bookingid}`, { headers: JSON_HEADERS });
    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject(data);
  });

  test('update booking with token changes the data', async ({ request }) => {
    const token = await getToken(request);
    const { bookingid } = await createBooking(request);
    const updated = newBooking({ firstname: 'Atualizado', totalprice: 999 });
    const res = await request.put(`${BASE}/booking/${bookingid}`, {
      data: updated,
      headers: { ...JSON_HEADERS, Cookie: `token=${token}` },
    });
    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject({ firstname: 'Atualizado', totalprice: 999 });
  });

  test('delete booking with token removes it', async ({ request }) => {
    const token = await getToken(request);
    const { bookingid } = await createBooking(request);
    const del = await request.delete(`${BASE}/booking/${bookingid}`, {
      headers: { Cookie: `token=${token}` },
    });
    expect(del.status()).toBe(201);
    const after = await request.get(`${BASE}/booking/${bookingid}`, { headers: JSON_HEADERS });
    expect(after.status()).toBe(404);
  });

  test('delete without token is forbidden', async ({ request }) => {
    const { bookingid } = await createBooking(request);
    const res = await request.delete(`${BASE}/booking/${bookingid}`);
    expect(res.status()).toBe(403);
  });

  test('reading a booking that does not exist returns 404', async ({ request }) => {
    const res = await request.get(`${BASE}/booking/999999999`, { headers: JSON_HEADERS });
    expect(res.status()).toBe(404);
  });

  test('create booking with missing fields is not accepted', async ({ request }) => {
    const res = await request.post(`${BASE}/booking`, { data: { firstname: 'So' }, headers: JSON_HEADERS });
    // Observed: this API answers 500 instead of 400. We only assert that it is an error.
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });
});
