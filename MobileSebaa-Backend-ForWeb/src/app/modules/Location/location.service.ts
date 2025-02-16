import Locations from './location.model';

export const LocationService = {
  getAllLocation: async () => {
    const country = await Locations.find({});

    return country;
  },
};
