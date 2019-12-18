module.exports = function (str) {
  const pattern = new RegExp('^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$', 'i')
  if (!pattern.test(str)) {
    return false
  } else {
    return true
  }
}
