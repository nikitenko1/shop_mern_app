export const numberFormatter = (amount) => {
  let formatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
  });
  return formatter.format(amount);
};
