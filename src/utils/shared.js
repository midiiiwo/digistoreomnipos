export const handleSearch = (search, payload) => {
  if (search && search.length === 0) {
    return payload;
  }
  return (
    payload &&
    payload.filter(v =>
      JSON.stringify(v).toLowerCase().includes(search.toLowerCase()),
    )
  );
};

export const formatNumberTwoSig = value =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
