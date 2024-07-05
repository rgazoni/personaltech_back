import { TypesCref } from "../types/validate-cref.types";

export class ValidateCrefEvent {
  user_id: string;
  cref: string;
  type: TypesCref;
}
