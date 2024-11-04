export default (url, db = 'https://allorigins.hexlet.app/get') => {
  const proxyUrl = new URL(db);
  const encodedUrl = encodeURI(url);
  proxyUrl.searchParams.set('url', encodedUrl);
  proxyUrl.searchParams.set('disableCache', 'true');
  return proxyUrl;
};
