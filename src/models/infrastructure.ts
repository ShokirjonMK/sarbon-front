import { IBasic } from "./base";


export interface IBuilding extends IBasic {
  id: number;
  name: string;
  description: string;
  status: number;
}

export interface IRoom extends IBasic {
  id: number;
  name: string;
  description: string;
  status: number;
  building_id: number;
  building?: IBuilding;
  capacity: number;
}

export interface IRoomType extends IBasic {
  id: number;
  name: string;
  description: string;
  status: number;
  order: number;
}