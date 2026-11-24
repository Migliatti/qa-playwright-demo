// Fictional booking data for the restful-booker practice API.
export function newBooking(overrides: Record<string, unknown> = {}) {
  return {
    firstname: 'Maria',
    lastname: 'Exemplo',
    totalprice: 150,
    depositpaid: true,
    bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}

// Public demo credentials, documented in the restful-booker API docs.
export const adminCredentials = { username: 'admin', password: 'password123' };
