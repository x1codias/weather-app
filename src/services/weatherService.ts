import axios from 'axios';
import moment from 'moment';

export type Forecast = {
  data: {
    list: {
      dt: number;
      main: {
        temp: number;
        temp_max: number;
        temp_min: number;
      };
      weather: {
        main: string;
        icon: string;
        description: string;
      }[];
      dt_txt: string;
    }[];
    city: {
      name: string;
      coord: {
        lat: number;
        lon: number;
      };
    };
  };
};

export const getFiveDayForecast = async (city: string, lang: string) => {
  const response: Forecast = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/forecast?q=${city}&appid=${import.meta.env.VITE_API_KEY}&units=metric&lang=${lang}`
  );

  // the code bellow serves to get forecast for 5 different days at 15:00
  const fiveDayForecast = [];

  for (let i = 0; i < response.data.list.length; i++) {
    if (
      moment(response.data.list[i].dt_txt).hour() === 15 &&
      (i === 0 ||
        fiveDayForecast.length === 0 ||
        moment(response.data.list[i].dt_txt).format('YYYY-MM-DD') !==
          moment(fiveDayForecast[fiveDayForecast.length - 1].dt_txt).format('YYYY-MM-DD'))
    ) {
      fiveDayForecast.push(response.data.list[i]);
    }
  }

  const formattedData: Forecast = { data: { ...response.data, list: fiveDayForecast } };

  return formattedData;
};
