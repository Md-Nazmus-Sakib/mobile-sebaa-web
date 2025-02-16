import mongoose, { Schema, Document } from 'mongoose';

interface IDistrict {
  name: string;
  towns: string[]; // Array of town names (stored as strings)
}

interface ILocation extends Document {
  name: string;
  districts: IDistrict[];
}

const DistrictSchema = new Schema<IDistrict>({
  name: { type: String, required: true },
  towns: [{ type: String, required: true }], // Store town names as an array of strings
});

const LocationSchema = new Schema<ILocation>({
  name: { type: String, required: true },
  districts: [DistrictSchema], // Array of districts
});

const Locations = mongoose.model<ILocation>('Location', LocationSchema);

export default Locations;
