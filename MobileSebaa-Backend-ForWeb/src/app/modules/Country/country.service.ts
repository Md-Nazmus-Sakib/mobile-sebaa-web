import { Countries } from './country.model';

export const CountryService = {
  getOneCountry: async (searchQuery: string) => {
    if (!searchQuery) return null;

    const country = await Countries.find({
      name: { $regex: new RegExp(searchQuery, 'i') }, // Case-insensitive regex search
    });

    return country;
  },
};
