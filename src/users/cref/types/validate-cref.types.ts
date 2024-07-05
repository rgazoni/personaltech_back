export const TypesCrefPossibilities = ['natural', 'juridical'] as const;

export type TypesCref = typeof TypesCrefPossibilities[number];

export type JuridicalCref = {
  name: string;
  company: string;
  state: string;
  city: string;
  address: string;
  neighborhood: string;
  zip: string;
  phone: string;
};
