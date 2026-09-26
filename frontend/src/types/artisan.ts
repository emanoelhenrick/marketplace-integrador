import { User } from "./user";

export interface Artisan extends User {
  role: "artisan";
  craft: string;
  craftYears: string;
  quote: string;
  location: string;
  polo?: string;
  region?: string;
  totalWorks: number;
}
