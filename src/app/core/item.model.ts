export interface Item {
  login: {
    uuid: string;
  };
  name: {
    first: string;
    last: string;
  };
  email: string;
  dob: {
    age: number;
  };
  phone: string;
  location: {
    country: string;
    state: string;
    city: string;
  };
  picture: {
    medium: string;
  };
}

export interface ItemsApiResponse {
  results: Item[];
}
