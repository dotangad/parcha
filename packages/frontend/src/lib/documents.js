export function queryDocuments(token, query) {
  return async function () {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/documents/query`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ query })
    });

    // TODO: handle success: false case
    return await response.json();
  }
}

export function fetchDocumentById(token, id) {
  return async function () {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/documents/find/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    // TODO: handle success: false case
    return await response.json();
  }
}