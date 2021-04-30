export default (phone = '') => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d)(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
  }
  return phone;
};
