import mongoose from "mongoose";
import { Art } from "../models/artModel.js";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongod.stop();
});

test("should create an Art document and match snapshot", async () => {
  const artData = {
    title: "Artwork Title",
    artist: "Artist Name",
    size: "Large",
    medium: "Oil on Canvas",
    description: "A beautiful piece of art.",
    image: "image_url",
  };

  const art = await Art.create(artData);
  expect(art.toObject()).toMatchSnapshot();
});
