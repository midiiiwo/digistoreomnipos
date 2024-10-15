export const handleSearch = (search, payload) => {
  if (search.length === 0) {
    return payload;
  }
  return payload.filter(v =>
    JSON.stringify(v).toLowerCase().includes(search.toLowerCase()),
  );
};
