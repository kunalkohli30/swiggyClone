export interface OrderRequestDto {
    "restaurantId": number,
    "createdAt": string,
    "addressId": number,
    "deliveryFee": number,
    "deliveryTip": number,
    "gstAndCharges": number,
    "couponCode": string,
    "discountAmount": number,
    "orderItems": OrderItemDto[]
}

export interface OrderItemDto {
    "foodId": number,
    "quantity": number
}

export interface OrderResponseDto {
    orderId: number,
    razorPayOrderId: string,
    orderStatus: 'PENDING' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED',
    createdAt: Date,
    orderItems: OrderItemDto[],
    deliveryTime: number,
    amount: number,
    receiptId: string
}

export interface ExistingOrderItemsDto {
    orderItemId: number,
    foodId: number,
    foodItemName: string,
    foodItemPrice: number,
    foodItemVeg: boolean,
    quantity: number,
    totalPrice: number
}

export interface ExistingOrdersDto {
    orderId: number,
    restaurantId: number,
    restaurantName: string,
    restaurantLocality: string,
    restaurantImageUrl: string,
    orderStatus: string,
    totalItem: number,
    totalAmount: number,
    createdAt: string,
    deliveryTimeInSeconds: number,
    deliveryFee: number,
    deliveryTip: number,
    gstAndFees: number,
    discountAmount: number,
    deliveryAddress: string,
    addressName: string,
    orderItems: ExistingOrderItemsDto[],
    userId: string,
    paymentMethod: string,
    cardNetwork: string,
    cardLast4: string
}
