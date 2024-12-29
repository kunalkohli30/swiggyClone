export interface RestaurantDto {
    "id": number,
    "name": string,
    "email": string,
    "description": string,
    "locality": string,
    "areaName": string,
    "city": string,
    "costForTwo": string,
    "avgRatingString": string,
    "totalRatingsString": string,
    "discountInfo": string,
    "imageId": string,
    "openingHours": string,
    "registrationDate": string,
    "instagram": string,
    "open": boolean,
    "cuisines": string[]
}
export interface FoodDto {
    "id": number,
    "name": string,
    "description": string,
    "price": number,
    "available": boolean,
    "creationDate": string,
    "imageId": string,
    "restaurantId": number,
    "foodCategory": string,
    "seasonal": boolean,
    "vegetarian": boolean
}

export type MenuDto = {
    "category": string,
    "foodItems": FoodDto[]
}

export type OfferDto {
    "id": number,
    "header": string,
    "couponCode": string,
    "description": string,
    "offerLogo": string,
    "offerType": string,
    "discountPercentage": number,
    "discountAmount": number,
    "minimumOrderValue": number,
    "restaurant": number
}