export interface City {
  active: boolean;
  endTimeS: string;
  startTimeW: string;
  city: string;
  endTimeW: string;
  startTimeS: string;
  is_emergency: boolean;
  emergencyEndTime: string
  emergencyStartTime: string
  neighborhoods: Neighborhood[]
}

export interface Neighborhood {
  name: string
  active: boolean
}

interface Service {
  active: boolean;
  service: string;
}

export interface Plataforma {
  plataforma: string;
  cities: City[];
  services: Service[];
}