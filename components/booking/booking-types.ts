export interface PublicService {
  id: string;
  name: string;
  duration: number;
  description: string;
  price: number;
  active: boolean;
}

export interface BookingHandoff {
  serviceId: string;
  date: string;
  startTime: string;
}

export interface CreatedBooking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  notes: string | null;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  service: {
    name: string;
  };
}
