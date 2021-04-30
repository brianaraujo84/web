export default (url, callback) => {
  const img = new Image();
  img.src = url;
  img.onload = callback;
};

const preLoadImageV2 = (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(true);
    img.src = src;
  });
};

export { preLoadImageV2 };
