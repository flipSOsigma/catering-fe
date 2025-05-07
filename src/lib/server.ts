const apiRoute = import.meta.env.VITE_API_ROUTE

export const getOrderData = async (uid?: string) => {
  const url = uid ? `${apiRoute}/order/${uid}` : `${apiRoute}/orders`;
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();
    return { data: data, length: data.length, status: 200 };
  } catch (err) {
    console.error('Fetch error:', err);
    return { data: [], error: err, length: 0, status: 500 };
  }
};