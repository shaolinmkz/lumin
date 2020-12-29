/**
 * @function currencyFormatter
 * @description Adds the currency prefix to the items
 * @param {number} amount - cost of item(s)
 * @param {string} currency - currency value for item
 * @returns {string} returns formatted string with a prefixed currency symbol
 */
export const currencyFormatter = (amount, currency) => {
  return amount?.toLocaleString(`en-${currency?.slice?.(0, 2)}`, {
    style: "currency",
    currency,
  });
};
