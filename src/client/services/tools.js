
/**
 * convert number to currenct
 * @param {number} num 
 * @return string
 */
export const toCurrency = (num) => {
  if ('string' === typeof num) {
    num = Number(num);
  } else if ('number' !== typeof num) {
    return null;
  }
  return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

};

