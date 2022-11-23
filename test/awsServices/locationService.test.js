const { expect } = require("chai");
const { mockClient } = require("aws-sdk-client-mock");
const {
  LocationClient,
  SearchPlaceIndexForTextCommand,
} = require("@aws-sdk/client-location");
const client = mockClient(LocationClient);
const service = require("../../src/awsservices/locationService");
describe("locationService test", () => {
  beforeEach(() => {
    client.reset();
  });
  it("findLocation", async () => {
    client.on(SearchPlaceIndexForTextCommand).resolves({
      Results: [
        {
          Relevance: 0.8,
          Place: {
            Geometry: {
              Point: [0, 0],
            },
          },
        },
        {
          Relevance: 1,
          Place: {
            Geometry: {
              Point: [0.1, 0.2],
            },
          },
        },
      ],
    });
    const rs = await service.findLocation("any", "any");
    expect(rs.lat).equal(0.2);
    expect(rs.lon).equal(0.1);
  });
});
