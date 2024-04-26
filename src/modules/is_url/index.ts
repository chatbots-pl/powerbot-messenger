export const isUrl = (str: string) => {
  const pattern = new RegExp('^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$', 'i')
  return pattern.test(str)
}
