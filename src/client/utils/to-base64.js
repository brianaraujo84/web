import loadImage from 'blueimp-load-image';

export default (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  const { type } = file;
  const extension = type === 'image/png' ? 'png' : 'jpg';
  reader.onload = () =>
    loadImage(reader.result, { orientation: true, maxHeight: 600, canvas: true }).then(({ image }) => {
      return resolve({
        tempContent: image.toDataURL('image/jpeg').replace(/^.*,/, ''),
        content: reader.result.replace(/^.*,/, ''),
        type,
        extension,
      });
    }).catch(() => {});
  reader.onerror = error => reject(error);
}).catch(() => {});

export const convertBlobURLToBase64 = (url) => new Promise((resolve, reject) => {
  const extension = 'png';
  const type = 'image/png';
  loadImage(url, { orientation: true, maxHeight: 600, canvas: true }).then(({ image }) => {
    return resolve({
      tempContent: image.toDataURL('image/jpeg').replace(/^.*,/, ''),
      content: image.toDataURL('image/png').replace(/^.*,/, ''),
      type,
      extension,
    });
  }).catch(error => reject(error));
}).catch(() => {});

