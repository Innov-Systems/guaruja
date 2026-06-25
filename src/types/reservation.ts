import type { Timestamp } from "firebase/firestore";

export type ReservationStatus =
  | "pre-reserva"
  | "reservado"
  | "sinal-pago"
  | "pago"
  | "cancelado";

export type Reservation = {
  id: string;
  customerName: string;
  phone: string;
  date: string;
  startTime: string;
  endTime: string;
  totalValue: number;
  depositValue: number;
  status: ReservationStatus;
  notes: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

export type ReservationFormData = Omit<
  Reservation,
  "id" | "createdAt" | "updatedAt"
>;
