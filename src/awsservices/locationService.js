const {
  LocationClient,
  SearchPlaceIndexForTextCommand,
} = require("@aws-sdk/client-location");

const client = new LocationClient({
  region: "us-east-2",
});

exports.findLocation = async (IndexName, Text) => {
  return await new Promise((res, rej) => {
    client
      .send(new SearchPlaceIndexForTextCommand({ IndexName, Text }))
      .then((response) => {
        const result = response.Results.sort(
          (a, b) => b.Relevance - a.Relevance
        )[0];
        res({
          lat: result.Place.Geometry.Point[1],
          lon: result.Place.Geometry.Point[0],
        });
      })
      .catch(rej);
  });
};
