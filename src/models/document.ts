import { IBasic } from "./base";
import IUsers, { IProfile } from "./user";

export interface IDocument extends IBasic {
  doc_number: string
  document_type_id: number
  document_weight_id: number
  end_date: number
  is_ok: 0 | 1 | 2
  file: string
  files: {
    created_at: number
    created_by: number
    description: string
    file: string
    id: number
    letter_id: number
    order: number
    status: number
    updated_at: number
    updated_by: number
  }[]
  id: number
  order: number
  start_date: number
  status: number
  title: string
  description: string
  user_id: number
  user?: IUsers
  letterOutgoing?: ILetterOutgoing
  documentType?: {
    name: string,
    id: number
    description: string
    status: number
  }
  importantLevel?: {
    name: string,
    id: number
    description: string
    status: number
  }
  documentWeight?: {
    name: string,
    id: number
    description: string
    status: number

  }
}

export interface ILetterQRCode extends IBasic {
  id: number
  status: number
  url: string
  letter_id: number
  letter_outgoing_id: number
  order: number
  qr_code: string
}

export interface ILetterOutgoing extends IBasic {
  body: {
    body: string
    id: number
    created_at: number
    created_by: number
    letter_outgoing_id: number
    order: number
    status: number
    updated_at: number
    updated_by: number
  }
  qrCode: ILetterQRCode[]
  message: string
  access_number: string
  created_at: number
  created_by: number
  description: string;
  file: string;
  id: number
  is_ok: number
  letter_id: number
  order: number
  output_number: number
  status: number
  updated_at: number
  updated_by: number
  user_id: number
  view_date: number
  view_type: number
  user: {
    id: number
    profile: IProfile
  }
}