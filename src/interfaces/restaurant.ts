export default interface restaurant  {
    info: {
        id: string,
        name: string,
        cloudinaryImageId: string,
        isOpen: boolean,
        cuisines: string[],
        costForTwo: string,
        areaName: string,
        locality: String,
        aggregatedDiscountInfoV3: {
            header: string,
            subHeader: string
        },
        sla: {
            slaString: string
        }
    }
    cta: {
        link: string
    }
}