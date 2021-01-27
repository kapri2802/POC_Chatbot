const { toXml, toJson } = require("json-xml");

function botService(query, url) {
  const xml = toXml(query);

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/xml",
      Accept: "application/xml",
    },
    body: xml,
  })
    .then((response) => response.text())
    .then((response) => {
      let valuejson = toJson(response);

      // this.setState({ valueJSObj: valuejson.data });

      return valuejson.data;
    });
}

export default botService;
