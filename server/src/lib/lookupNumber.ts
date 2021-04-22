import axios, { AxiosResponse } from "axios";

const parseNumber = (data: string) => {};

export default async (number: string) => {
  const data: AxiosResponse = await axios.get(
    `https://who-called.co.uk/Number/${number}`
  );

  return data;
};
