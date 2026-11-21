namespace ClothingStore.Domain.Enums;

public enum UserType
{
    Customer,
    Staff,
    Admin
}

public enum StaffRole
{
    SuperAdmin,
    Admin,
    OrderManager,
    ProductManager,
    PaymentManager,
    CustomerSupport
}

public enum GenderCollection
{
    Men,
    Women,
    Unisex
}

public enum ProductStatus
{
    Published,
    Draft,
    Archived
}

public enum CategoryStatus
{
    Active,
    Inactive
}

public enum CollectionStatus
{
    Active,
    Draft
}

public enum PaymentMethodType
{
    COD,
    eSewa,
    Khalti,
    Fonepay
}

public enum PaymentStatusType
{
    PendingVerification,
    Verified,
    Rejected,
    CodPending,
    Paid
}

public enum OrderStatusType
{
    Placed,
    Confirmed,
    Processing,
    Dispatched,
    Delivered,
    Cancelled
}

public enum DeliveryMethodType
{
    Standard,
    Express
}

public enum CouponDiscountType
{
    Percentage,
    Fixed
}

public enum CouponStatus
{
    Active,
    Inactive
}

public enum ReviewStatus
{
    Approved,
    Pending,
    Rejected
}

public enum NotificationCategory
{
    Order,
    Payment,
    Stock,
    Account
}

public enum NotificationTarget
{
    Customer,
    Admin,
    Both
}
