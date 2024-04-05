export interface ILocation {
    admin_id: string;
    state: string;
    city: "all" | "some";
    cities: string[];
  }
  