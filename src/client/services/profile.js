import remote from './remote';

export function _login(data) {
  return remote()
    .post('/login', data)
    .then(resolved => resolved.data);
}

export function _logout(data) {
  return remote()
    .post('/v1/logout', data)
    .then(resolved => resolved.data);
}
export function _postService(path, data) {
  return remote()
    .post(path, data)
    .then(resolved => resolved.data);
}

/**
 * get user profile data
 * @return {Promise}
 */
export function _getUserData() {
  return remote()
    .get('/v1/confidence/user')
    .then(resolved => resolved.data);
}

/**
 * Forgot Password
 * @return {Promise}
 */
export function _forgotPassword(data) {
  return remote()
    .post('/v1/user/forgotpassword', data)
    .then(resolved => resolved.data);
}

/**
 * Reset Password
 * @return {Promise}
 */
export function _resetPassword(data) {
  return remote()
    .post('/v1/user/confirmforgotpassword', data)
    .then(resolved => resolved.data);
}

/**
 * Is Subscription Valid
 * @return {Promise}
 */
export function _isSubscriptionValid() {
  return remote()
    .get('/v1/confidence/subscription')
    .then(resolved => resolved.data);
}

/**
 * Start Free Trail
 * @return {Promise}
 */
export function _startFreeTrail(data) {
  return remote()
    .post('/v1/confidence/subscription/trial', data)
    .then(resolved => resolved.data);
}

/**
 * Check User Upgrade
 * @return {Promise}
 */
export function _checkUserUpgrade() {
  return remote()
    .get('/v1/confidence/userpreferences')
    .then(resolved => resolved.data);
}
