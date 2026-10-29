const jsonResponse = (body, status = 200) => new Response(JSON.stringify(body), { status });

const mockFetch = (t, body, status = 200) => t.mock.method(globalThis, "fetch", async () => jsonResponse(body, status));

const requestedUrl = (fetchMock) => fetchMock.mock.calls[0].arguments[0];

module.exports = { jsonResponse, mockFetch, requestedUrl };
