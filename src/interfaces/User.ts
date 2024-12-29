export default interface UserType {
    uid: string,
    email: string,
    role: 'ROLE_CUSTOMER' | 'ROLE_ADMIN',
    fullName: string,
    imageUrl: string,
    phoneNumber: string
}