import { z } from "zod";

export const UserSchema = z.object({
  username: z.string(),
  jwt: z.string(),
});

export type User = z.infer<typeof UserSchema> | null;

export type Member = {
  id: number;
  name: string;
  surname: string;
  province: string;
  birthDate: string;
  birthPlace: string;
  email: string;
  docType: string;
  docId: string;
  country: string;
  suspendedTill: string;
  expirationDate: string;
  cardNumber: string;
  isActive: boolean;
  isDeleted: boolean;
  status: string;
  measure: string;
  registrationDate: string;
  note: string;
};

export type MemberDTO = {
  id: number;
  name: string;
  surname: string;
  province: string;
  birth_date: string;
  birth_place: string;
  email: string;
  doc_type: string;
  doc_id: string;
  country: string;
  suspended_till: string | null;
  expiration_date: string;
  card_number: string | null;
  isActive: boolean;
  isDeleted: boolean;
  measure: string | null;
  registrationDate: string;
  note: string | null;
};
