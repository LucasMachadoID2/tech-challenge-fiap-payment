export interface User {
  id: string;
  email: string;
  name: string;
  slug: string;
  city: string | null;
  maximunAttendees: number | null;
  createdAt: Date;
  updatedAt: Date;
}
export interface CreateUserDTO {
  email: string;
  name: string;
  slug: string;
  city: string | null;
  maximunAttendees: number | null;
  createdAt: Date;
  updatedAt: Date;
}
