const Dropbox = require('dropbox').Dropbox;
const fetch = require('isomorphic-fetch');

const SETTINGS = require('./settings');
const dbx = new Dropbox({ accessToken: SETTINGS.DROPBOX_ACCESS_TOKEN, fetch });

const services = {};

const thumbSizes = {
  1: 'w32h32',
  2: 'w64h64',
  3: 'w128h128',
  4: 'w256h256',
  5: 'w480h320',
  6: 'w640h480',
  7: 'w960h640',
  8: 'w1024h768',
  9: 'w2048h1536',
};

services.getThumb = (path, sizeNum = 2, format = 'jpeg') => {
  const size = thumbSizes[sizeNum] || thumbSizes[2];
  return dbx.filesGetThumbnail({
    path,
    format,
    mode: 'strict',
    size,
  });
};

services.getImageLink = (path) => {
  return dbx.filesGetTemporaryLink({
    path,
  });
};

services.getImage = (path) => {
  return dbx.filesDownload({
    path,
  });
};

services.uploadFile = (path, contents) => {
  return dbx.filesUpload({
    path,
    contents,
    mode: {
      '.tag': 'overwrite',
    },
  });
};

services.filesGetTemporaryUploadLink = (path) => {
  return dbx.filesGetTemporaryUploadLink({ commit_info : { path }});
};

services.filesGetTemporaryLink = (path) => {
  return dbx.filesGetTemporaryLink({ path });
};

services.deleteFile = (path) => {
  return dbx.filesDelete({
    path,
  });
};

services.listFolder = (path) => {
  return dbx.filesListFolder({
    path,
  });
};

services.copyFile = (from_path, to_path) => {
  return dbx.filesCopyV2({
    from_path,
    to_path,
  });
};

services.copyBatch = (from_path, to_path) => {
  return dbx.filesCopyBatchV2({ entries: [{from_path, to_path}], autorename: false });
};

module.exports = services;
