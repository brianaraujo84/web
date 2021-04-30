const express = require('express');

const {
  getThumb,
  getImageLink,
  getImage,
  uploadFile,
  deleteFile,
  listFolder,
  copyFile,
  copyBatch,
  filesGetTemporaryUploadLink,
  filesGetTemporaryLink,
} = require('./dropbox-services');
const Paths = require('./paths');

const isLoggedIn = require('./services').isLoggedIn;

const placeholderUserImg = '/assets/img/profile-ghost.jpg';
const placeholderTemplateImg = '/assets/img/logo-gray.png';

const router = express.Router({ mergeParams: true });

// User Profile

router.get('/user/:username', async (req, res) => {
  res.status(302);
  try {
    if (!req.isAuthenticated()) {
      throw 'Not authenticated';
    }
    const { username } = req.params;
    const path = Paths.profile(username);
    const { entries } = await listFolder(path);
    if (entries && entries.length) {
      const images = entries.filter(f => f['.tag'] === 'file');
      images.sort((a, b) => new Date(b.server_modified) - new Date(a.server_modified));
      const data = await (getImageLink(images[0].path_display));
      res.set('location', data.link);
    } else {
      res.set('location', placeholderUserImg);
    }
  } catch (error) {
    res.set('location', placeholderUserImg);
  }
  res.end();
});

router.get('/user/:username/thumb/:size?', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      throw 'Not authenticated';
    }
    const { username, size = 4 } = req.params;
    const path = Paths.profile(username);

    const { entries } = await listFolder(path);
    if (entries && entries.length) {
      const images = entries.filter(f => f['.tag'] === 'file');
      images.sort((a, b) => new Date(b.server_modified) - new Date(a.server_modified));
      const data = await (getThumb(images[0].path_display, size));
      const contentType = data.name.substr(-3) === 'png' ? 'image/png' : 'image/jpeg';
      res.set('Content-Type', contentType);
      // res.set('Content-Length', data.size);
      //res.set('Cache-Control', 'public, max-age=86400');
      res.send(data.fileBinary);
    } else {
      res.status(302);
      res.set('location', placeholderUserImg);
    }
  } catch (error) {
    console.error(error.error);
    res.status(302);
    res.set('location', placeholderUserImg);
  }
  res.end();
});

// Task Comments
router.get('/task/:type/:taskId/comments/:commentId', isLoggedIn, async (req, res) => {
  const { params, originalUrl } = req;

  const { type, taskId, commentId } = params;
  try {
    const path = Paths.taskComment(taskId, type, commentId);
    const data = await listFolder(path);
    const list = data.entries.map(({ name }) => ({
      url: `${originalUrl}/${name}/5`,
      originUrl: `${originalUrl}/${name}`,
      name
    }));
    res.set('Cache-Control', 'no-store');
    res.json({ list });
  } catch (error) {
    res.json({ list: [] });
  }
});

router.get('/task/:type/:taskId/comments/:commentId/:name/:size?', isLoggedIn, async (req, res) => {
  const { params } = req;

  const { type, taskId, name, size, commentId } = params;
  // if (name === 'comments') {
  //   return;
  // }
  try {
    const folder = Paths.taskComment(taskId, type, commentId);
    const path = `${folder}/${name}`;
    const data = size ? await getThumb(path, size) : await getImage(path);
    const contentType = data.name.substr(-3) === 'png' ? 'image/png' : 'image/jpeg';
    res.set('Content-Type', contentType);
    // res.set('Content-Length', data.size);
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(data.fileBinary);

  } catch (error) {
    console.error(error.error);
    return res.status(404).send({ message: 'Not found' });
  }
});

router.post('/comment', isLoggedIn, async (req, res) => {
  const { body, url } = req;

  const { files, type, taskId, commentId } = body;

  try {
    const promises = [];

    for (let i = 0; i < files.length; i++) {
      const img = files[i];
      const { extension, content } = img;
      const folder = Paths.taskComment(taskId, type, commentId);
      const fileName = `comment_${i}.${extension}`;
      const path = `${folder}/${fileName}`;
      const p = uploadFile(path, Buffer.from(content, 'base64'));
      promises.push(p);
    }

    await Promise.allSettled(promises);
    return res.status(200).json({ message: `${files.length} images uploaded` });
  } catch (error) {
    console.error(url, error.error);
    return res.status(400).send(error);
  }
});

router.delete('/task/:type/:taskId/comments/:commentId/:name/', isLoggedIn, async (req, res) => {
  const { params } = req;
  const { name, type, taskId, commentId } = params;

  try {
    const folder = Paths.taskComment(taskId, type, commentId);
    const path = `${folder}/${name}`;

    await deleteFile(path);

    return res.status(200).json({ message: 'image deleted' });
  } catch (error) {
    console.error(error.error);
    return res.status(400).send(error);
  }
});

// Task
router.get('/task/:type/:taskId', isLoggedIn, async (req, res) => {
  const { params, originalUrl } = req;

  const { type, taskId } = params;
  try {
    const path = Paths.task(taskId, type);
    const data = await listFolder(path);
    const list = data.entries.filter(item => item.name !== 'comments').map(({ name }) => ({
      url: `${originalUrl}/${name}/6`,
      originUrl: `${originalUrl}/${name}`,
      name
    }));
    res.set('Cache-Control', 'no-store');
    res.json({ list });
  } catch (error) {
    res.json({ list: [] });
  }
});

router.get('/task/:type/:taskId/:name/:size?', isLoggedIn, async (req, res) => {
  const { params } = req;

  const { type, taskId, name, size } = params;
  try {
    const folder = Paths.task(taskId, type);
    const path = `${folder}/${name}`;
    const data = size ? await getThumb(path, size) : await getImage(path);
    const contentType = data.name.substr(-3) === 'png' ? 'image/png' : 'image/jpeg';
    res.set('Content-Type', contentType);
    // res.set('Content-Length', data.size);
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(data.fileBinary);

  } catch (error) {
    console.error(error.error);
    return res.status(404).send({ message: 'Not found' });
  }
});

router.get('/header/image/:name', isLoggedIn, async (req, res) => {
  const { params } = req;

  const { name } = params;
  try {
    const folder = Paths.header;
    const path = `${folder}/${name}`;
    const data = await getImage(path);
    const contentType = data.name.substr(-3) === 'png' ? 'image/png' : 'image/jpeg';
    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(data.fileBinary);

  } catch (error) {
    console.error(error.error);
    return res.status(404).send({ message: 'Not found' });
  }
});


router.post('/task', isLoggedIn, async (req, res) => {
  const { body, url } = req;

  const { files, type, taskId, commentId } = body;

  try {
    const promises = [];

    for (let i = 0; i < files.length; i++) {
      const img = files[i];
      const { extension, content, imageName } = img;
      const folder = Paths.task(taskId, type);
      const fileName = commentId ? `${commentId}.${extension}` : (imageName || `image_${Date.now()}.${extension}`);
      const path = commentId ? `${folder}/comments/${fileName}` : `${folder}/${fileName}`;
      const p = uploadFile(path, Buffer.from(content, 'base64'));
      promises.push(p);
    }

    await Promise.allSettled(promises);
    return res.status(200).json({ message: `${files.length} images uploaded` });
  } catch (error) {
    console.error(url, error.error);
    return res.status(400).send(error);
  }
});

router.post('/task-copy', isLoggedIn, async (req, res) => {
  const { body, url } = req;

  const { type, taskId, newTaskId, newType = type } = body;
  try {
    if (!taskId || !newTaskId || !type || !newType) {
      return res.status(400).send({ message: 'Not enough data!' });
    }
    const pathFrom = Paths.task(taskId, type);
    const pathTo = Paths.task(newTaskId, newType);
    await copyFile(pathFrom, pathTo);
    return res.status(200).json({ message: 'Folder copied' });
  } catch (error) {
    console.error(url, error.error);
    return res.status(200).json({ message: 'Unable to copy' });
  }
});

router.delete('/task/:type/:taskId/:name', isLoggedIn, async (req, res) => {
  const { params } = req;
  const { name, type, taskId } = params;

  try {
    const folder = Paths.task(taskId, type);
    const path = `${folder}/${name}`;

    await deleteFile(path);

    return res.status(200).json({ message: 'image deleted' });
  } catch (error) {
    console.error(error.error);
    return res.status(400).send(error);
  }
});

// Job Activity


router.get('/job-activity/:activityId/:trackedId', isLoggedIn, async (req, res) => {
  const { params, originalUrl } = req;

  const { activityId, trackedId } = params;
  try {
    const path = Paths.jobActivity(activityId, trackedId);
    const data = await listFolder(path);
    const list = data.entries.map(({ name }) => ({
      url: `${originalUrl}/${name}/6`,
      originUrl: `${originalUrl}/${name}`,
      name,
    }));
    res.set('Cache-Control', 'no-store');
    res.json({ list });
  } catch (error) {
    res.json({ list: [] });
  }
});

router.get('/job-activity/:activityId/:trackedId/:name/:size?', isLoggedIn, async (req, res) => {
  const { params } = req;

  const { activityId, trackedId, name, size } = params;
  try {
    const folder = Paths.jobActivity(activityId, trackedId);
    const path = `${folder}/${name}`;
    const data = size ? await getThumb(path, size) : await getImage(path);
    const contentType = data.name.substr(-3) === 'png' ? 'image/png' : 'image/jpeg';
    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(data.fileBinary);
    // if (size) {
    //   const data = await (getThumb(path, size));
    //   const contentType = data.name.substr(-3) === 'png' ? 'image/png' : 'image/jpeg';
    //   res.set('Content-Type', contentType);
    //   res.set('Cache-Control', 'public, max-age=2592000');
    //   res.send(data.fileBinary);
    // } else {
    //   const data = await getImageLink(path);
    //   res.status(302);
    //   res.set('location', data.link);
    //   res.end();
    // }

  } catch (error) {
    console.error(error.error);
    return res.status(404).send({ message: 'Not found' });
  }
});

router.post('/job-activity', isLoggedIn, async (req, res) => {
  const { body } = req;

  const { files, activityId, trackedId } = body;

  try {
    const promises = [];

    for (let i = 0; i < files.length; i++) {
      const img = files[i];
      const { extension, content, imageName } = img;
      const folder = Paths.jobActivity(activityId, trackedId);
      const fileName = imageName || `image_${Date.now()}.${extension}`;
      const path = `${folder}/${fileName}`;
      const p = uploadFile(path, Buffer.from(content, 'base64'));
      promises.push(p);
    }

    await Promise.allSettled(promises);
    return res.status(200).json({ message: `${files.length} images uploaded` });
  } catch (error) {
    console.error(error.error);
    return res.status(400).send(error);
  }
});

router.post('/job-activity-copy', isLoggedIn, async (req, res) => {
  const { body, url } = req;

  const { activityId, trackedId, newActivityId, newTrackedId } = body;
  try {
    if (!activityId || !trackedId || !newActivityId || !newTrackedId) {
      return res.status(400).send({ message: 'Not enough data!' });
    }
    const pathFrom = Paths.jobActivity(activityId, trackedId);
    const pathTo = Paths.jobActivity(newActivityId, newTrackedId);
    await copyFile(pathFrom, pathTo);
    return res.status(200).json({ message: 'Folder copied' });
  } catch (error) {
    console.error(url, error.error);
    return res.status(200).json({ message: 'Unable to copy' });
  }
});

router.delete('/job-activity/:activityId/:trackedId/:name', isLoggedIn, async (req, res) => {
  const { params } = req;

  const { name, activityId, trackedId } = params;

  try {
    const folder = Paths.jobActivity(activityId, trackedId);
    const path = `${folder}/${name}`;

    await deleteFile(path);

    return res.status(200).json({ message: 'image deleted' });
  } catch (error) {
    console.error(error.error);
    return res.status(400).send(error);
  }
});

router.get('/device/:templateId/virtualdevice/:name', isLoggedIn, async (req, res) => {
  const emptyPng = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  const { params } = req;
  const { templateId, name } = params;
  try {
    const path = Paths.device(templateId, name);
    const data = await getImage(path);
    const contentType = data.name.substr(-3) === 'png' ? 'image/png' : 'image/jpeg';
    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(data.fileBinary);
  } catch (error) {
    console.error(error.error);
    res.status(302);
    res.set('Content-Type', 'image/png');
    res.send(emptyPng);
  }
});

// templates
router.get('/template/:templateId/logo/:name', isLoggedIn, async (req, res) => {
  const { params } = req;

  const { templateId, name } = params;
  try {
    const path = Paths.logoTemplate(templateId, name);
    const data = await getImage(path);
    const contentType = data.name.substr(-3) === 'png' ? 'image/png' : 'image/jpeg';
    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(data.fileBinary);
  } catch (error) {
    console.error(error.error);
    res.status(302);
    res.set('location', placeholderTemplateImg);
    res.end();
  }
});

router.get('/template/:templateId/:taskId/:size?', isLoggedIn, async (req, res) => {
  const emptyPng = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  const { templateId, taskId, size } = req.params;
  const path = Paths.templateImage(templateId, taskId);
  try {
    const { entries } = await listFolder(path);
    if (entries && entries.length) {
      const images = entries.filter(f => f['.tag'] === 'file');
      images.sort((a, b) => new Date(b.server_modified) - new Date(a.server_modified));
      const data = size ? await getThumb(images[0].path_display, size) : await getImage(images[0].path_display);
      const contentType = data.name.substr(-3) === 'png' ? 'image/png' : 'image/jpeg';
      res.set('Content-Type', contentType);
      res.set('Cache-Control', 'public, max-age=86400');
      //res.set('Cache-Control', 'public, no-store, no-cache, max-age=0');
      res.send(data.fileBinary);
    } else {
      res.set('Content-Type', 'image/png');
      res.send(emptyPng);
    }
  } catch (error) {
    res.set('Content-Type', 'image/png');
    res.send(emptyPng);
  }
  res.end();
});

router.delete('/template/:templateId/:taskId/', isLoggedIn, async (req, res) => {
  const { params } = req;
  const { templateId, taskId } = params;

  try {
    const folder = Paths.templateImage(templateId, taskId);
    const path = `${folder}`;
    await deleteFile(path);

    return res.status(200).json({ message: 'image deleted' });
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.post('/template', isLoggedIn, async (req, res) => {
  const { body, url } = req;

  const { files, templateId, taskId, intendedFileName } = body;
  try {
    const promises = [];

    for (let i = 0; i < files.length; i++) {
      const img = files[i];
      const { extension, content } = img;
      const folder = Paths.templateImage(templateId, taskId);
      const fileName = intendedFileName ? `${intendedFileName}.${extension}` : `image_${Date.now()}.${extension}`;
      const path = `${folder}/${fileName}`;
      const p = uploadFile(path, Buffer.from(content, 'base64'));
      promises.push(p);
    }

    await Promise.allSettled(promises);
    return res.status(200).json({ message: `${files.length} images uploaded` });
  } catch (error) {
    console.error(url, error.error);
    return res.status(400).send(error);
  }
});


router.get('/dbx/signed-url/:folderName/:fileName', isLoggedIn, async (req, res) => {
  const { folderName, fileName } = req.params;
  try {
    const path = Paths.taskFilePath(folderName, fileName);
    const data = await filesGetTemporaryUploadLink(path);
    res.set('Cache-Control', 'no-store');
    res.json({ link: data.link });
  } catch (error) {
    console.error(error.error);
    return res.status(404).send({ message: 'Not found' });
  }
});

router.post('/dbx/signed-url', isLoggedIn, async (req, res) => {
  const { body } = req;
  const { path } = body;
  try {
    const path1 = Paths.wrapEnvName(path);
    const data = await filesGetTemporaryUploadLink(path1);
    res.set('Cache-Control', 'no-store');
    res.json({ link: data.link });
  } catch (error) {
    console.error(error.error);
    return res.status(404).send({ message: 'Not found' });
  }
});

router.get('/dbx/signed-read/:folderName/:fileName', isLoggedIn, async (req, res) => {
  const { folderName, fileName } = req.params;
  try {
    const path = Paths.taskFilePath(folderName, fileName);
    const data = await filesGetTemporaryLink(path);
    res.redirect(data.link);
  } catch (error) {
    console.error(error.error);
    return res.status(404).send({ message: 'Not found' });
  }
});

router.get('/dbx/comment-file-path/:folderName/:taskId', isLoggedIn, async (req, res) => {
  const { folderName } = req.params;

  try {
    const path = Paths.taskFilePath(folderName);
    const data = await listFolder(path);

    const resData = [];
    if (data.entries && data.entries.length > 0) {

      data.entries.forEach((entry) => {
        // const entry = data.entries[0] || {};
        const pathChunks = entry.path_display.split('/');
        const reqPath = `/${pathChunks[3]}/${pathChunks[4]}`;
        resData.push({link: reqPath, isFileExist: true});
      });
    }

    res.set('Cache-Control', 'no-store');
    res.json(resData);
  } catch (error) {
    return res.status(200).send({ isFileExist: false });
  }
});

router.get('/dbx/file-path/:folderName/:jobActivityId?', isLoggedIn, async (req, res) => {
  const { folderName, jobActivityId } = req.params;

  try {
    const path = Paths.taskFilePath(folderName);
    const data = await listFolder(path);
    let resData = { isFileExist: false };
    if (data.entries && data.entries.length > 0) {
      const entry = data.entries[0] || {};
      const pathChunks = entry.path_display.split('/');
      const reqPath = `/${pathChunks[3]}/${pathChunks[4]}`;
      resData = {link: reqPath, isFileExist: true};
    }

    if (jobActivityId) {
      let jaData = {};
      try {
        jaData = await listFolder(Paths.taskFileActivityPath(folderName, jobActivityId));
        if (jaData.entries && jaData.entries.length > 0) {
          const entry = jaData.entries[0] || {};
          const pathChunks = entry.path_display.split('/');
          const reqPath = `/${pathChunks[3]}/${pathChunks[4]}`;
          resData.jobActivityLink = reqPath;
          resData.isFileActivityExist = true;
        }
      } catch (e) {
        jaData = {};
      }
    }

    res.set('Cache-Control', 'no-store');
    res.json(resData);
  } catch (error) {
    return res.status(200).send({ isFileExist: false });
  }
});

router.get('/dbx/file-delete/:folderName/:fileName', isLoggedIn, async (req, res) => {
  const { folderName, fileName } = req.params;
  try {
    const path = Paths.taskFilePath(folderName, fileName);
    const data = await deleteFile(path);
    res.set('Cache-Control', 'no-store');
    res.json(data);
  } catch (error) {
    console.error(error.error);
    return res.status(400).send({ message: 'unable to delete'});
  }
});

router.get('/dbx/file-copy/:fromFolderName/:toFolderName', isLoggedIn, async (req, res) => {
  const { fromFolderName, toFolderName } = req.params;
  try {
    const pathFrom = Paths.taskFilePathCopy(fromFolderName);
    const pathTo = Paths.taskFilePathCopy(toFolderName);
    // console.log(fromFolderName, toFolderName, pathFrom, pathTo);
    await copyBatch(pathFrom, pathTo);
    res.set('Cache-Control', 'no-store');
    res.json({link: toFolderName});
  } catch (error) {
    console.error(error);
    return res.status(400).send({message: 'unable to copy'});
  }
});

module.exports = router;
