import axios, { AxiosResponse } from "axios";

const parseNumber = (data) => {};

export default async (number) => {
  const data: AxiosResponse = await axios.get(
    `https://who-called.co.uk/Number/${number}`
  );

  return data;
};
