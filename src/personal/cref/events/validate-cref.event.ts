import { TypesCref } from "../types/validate-cref.types";

export class ValidateCrefEvent {
  personal_id: string;
  cref: string;
  type: TypesCref;
}
