export interface UpdateCartModel {
    foodId: number,
    quantity: number,
    operation: 'ADD' | 'SUBTRACT'
}

export interface CartResponseModel {
    "cartId": number | null,
    "restaurantId": number | null,
    "restaurantName": string | null,
    "restaurantImageUrl": string | null,
    "restaurantAreaName": string | null,
    "cartItems": cartItemResponse[]
}

export interface cartItemResponse {
    "foodId": number | null,
    "foodItemName": string | null,
    "quantity": number | null,
    "unitPrice": number | null,
    "totalPrice": number | null,
    "veg": boolean | null
}