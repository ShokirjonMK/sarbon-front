import { ICreateOrUpdateBy } from "./base"

export interface IRole {
    category: string
    created_at: string
    description: string
    name: string
    pretty_name: string
    updated_at: string
    child?: Array<{
        child: string;
        parent: string;
    }>
    parent?: Array<{
        child: string;
        parent: string;
    }>
    permissions: Array<IRolePermissions>;
    createdBy?: ICreateOrUpdateBy;
    updatedBy?: ICreateOrUpdateBy;
}

export interface IRolePermissions {
    category: string
    created_at: string
    description: string
    name: string
    pretty_name: string
    updated_at: string
}

export interface IPermission {
    category: string
    permissions: Array<{
        name: string;
        title: string
    }>
}