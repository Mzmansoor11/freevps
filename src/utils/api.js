const API_BASE_URL = 'https://mzansi-cart-api.onrender.com';

export const checkApiHealth = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Server responded with HTTP ${response.status}`);
    }

    const data = await response.json();
    if (data.status !== 'ok' || data.service !== 'mzansi-cart-api') {
      throw new Error('The server returned an unexpected health response.');
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Connection timed out. Please try again.');
    }
    throw new Error(error.message || 'Could not connect to the backend.');
  } finally {
    clearTimeout(timeout);
  }
};

export { API_BASE_URL };
