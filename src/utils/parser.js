export default (xml) => {
  const parser = new DOMParser();
  const parsedXml = parser.parseFromString(xml, 'application/xml');
  return parsedXml;
};
