export default async (dataUrl, fileName, type = 'image/png') => {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], fileName, { type });
};
