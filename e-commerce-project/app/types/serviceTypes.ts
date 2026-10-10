export type serviceEntityType={name:string,description:string,providers?:any}

export type serviceResponseObject={
    id:number,
    name:string,
    description:string,
    providersId:string,
    providerImage?:string,
    fee?:string,
    conditions?:string[],
    serviceVideos?:string[],
    serviceImages?:string[],
    provider?:{}
}
