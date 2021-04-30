import toBase64, { convertBlobURLToBase64 } from './to-base64';

export default (files, isUrl=false) => {
  const promises = [];
  for (let i = 0; i < files.length; i++) {
    promises.push(isUrl ? convertBlobURLToBase64(files[i]) : toBase64(files[i]));
  }
  return Promise.allSettled(promises);
};
