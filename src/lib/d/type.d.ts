// src/types.d.ts
export interface Portion {
  id: string;
  portion_name: string;
  portion_note: string;
  portion_count: number;
  portion_price: number;
  portion_total_price: number;
}

export interface Section {
  id: string;
  section_name: string;
  section_note: string;
  section_price: number;
  section_portion: number;
  section_total_price: number;
  portions: Portion[];
}

export interface OrderData {
  unique_id: string;
  event_name: string;
  invitation: number;
  visitor: number;
  note: string;
  price: number;
  portion: number;
  customer: {
    id: string;
    customer_name: string;
    customer_phone: string;
    customer_email: string;
  };
  event: {
    id: string;
    event_name: string;
    event_location: string;
    event_date: string;
    event_building: string;
    event_category: string;
    event_time: string;
  };
  sections: Section[];
}