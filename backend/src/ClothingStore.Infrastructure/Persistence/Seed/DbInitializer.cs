using Microsoft.EntityFrameworkCore;
using ClothingStore.Application.Common.Interfaces;
using ClothingStore.Domain.Entities;
using ClothingStore.Domain.Enums;

namespace ClothingStore.Infrastructure.Persistence.Seed;

public static class DbInitializer
{
    public static async Task InitializeAsync(MaisonVeraDbContext context, IPasswordHasher passwordHasher)
    {
        // 1. Roles
        if (!await context.Roles.AnyAsync())
        {
            var superAdminRole = new Role
            {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Name = "Super Admin",
                NormalizedName = "SUPER ADMIN",
                Description = "Unrestricted authority across all atelier modules and security systems.",
                IsSystemRole = true
            };

            var adminRole = new Role
            {
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                Name = "Admin",
                NormalizedName = "ADMIN",
                Description = "Full operational control over catalog, orders, and clients.",
                IsSystemRole = true
            };

            var orderManagerRole = new Role
            {
                Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                Name = "Order Manager",
                NormalizedName = "ORDER MANAGER",
                Description = "Dispatches, manages logistics, and updates order states.",
                IsSystemRole = true
            };

            var productManagerRole = new Role
            {
                Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                Name = "Product Manager",
                NormalizedName = "PRODUCT MANAGER",
                Description = "Manages garment catalog, releases, and inventory allocations.",
                IsSystemRole = true
            };

            var paymentManagerRole = new Role
            {
                Id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                Name = "Payment Manager",
                NormalizedName = "PAYMENT MANAGER",
                Description = "Reviews and verifies manual digital wallet payments and bank statements.",
                IsSystemRole = true
            };

            var customerSupportRole = new Role
            {
                Id = Guid.Parse("66666666-6666-6666-6666-666666666666"),
                Name = "Customer Support",
                NormalizedName = "CUSTOMER SUPPORT",
                Description = "Manages inquiries, customer dossiers, and review moderation.",
                IsSystemRole = true
            };

            var customerRole = new Role
            {
                Id = Guid.Parse("77777777-7777-7777-7777-777777777777"),
                Name = "Customer",
                NormalizedName = "CUSTOMER",
                Description = "Private atelier client purchasing garments and accessing client portal.",
                IsSystemRole = true
            };

            await context.Roles.AddRangeAsync(
                superAdminRole, adminRole, orderManagerRole, productManagerRole, paymentManagerRole, customerSupportRole, customerRole);

            // Seed Super Admin User
            var adminUser = new User
            {
                Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                Email = "admin@maisonvera.com",
                NormalizedEmail = "ADMIN@MAISONVERA.COM",
                PhoneNumber = "+977 1 4239800",
                PasswordHash = passwordHasher.HashPassword("Admin123!"),
                UserType = UserType.Admin,
                IsActive = true,
                EmailConfirmed = true,
                PhoneConfirmed = true
            };

            var adminStaffProfile = new StaffProfile
            {
                UserId = adminUser.Id,
                FullName = "Maison Véra Atelier Director",
                EmployeeCode = "MV-DIR-001",
                Department = "Executive Directorate",
                LastActiveAt = DateTimeOffset.UtcNow
            };

            var adminUserRole = new UserRole
            {
                UserId = adminUser.Id,
                RoleId = superAdminRole.Id,
                AssignedAt = DateTimeOffset.UtcNow
            };

            // Seed Demo Customer User
            var demoCustomer = new User
            {
                Id = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                Email = "elena.rostova@example.com",
                NormalizedEmail = "ELENA.ROSTOVA@EXAMPLE.COM",
                PhoneNumber = "+977 9841234567",
                PasswordHash = passwordHasher.HashPassword("Password123!"),
                UserType = UserType.Customer,
                IsActive = true,
                EmailConfirmed = true,
                PhoneConfirmed = true
            };

            var customerProfile = new CustomerProfile
            {
                UserId = demoCustomer.Id,
                FullName = "Elena Rostova",
                AvatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
                JoinedDate = DateTimeOffset.UtcNow.AddMonths(-3),
                TotalOrders = 3,
                TotalSpent = 98500.00m,
                VipTier = "Private Atelier",
                InternalNotes = "Prefers double-faced cashmere and architectural wool coats in size 48 / M."
            };

            var demoAddress = new CustomerAddress
            {
                Id = Guid.NewGuid(),
                UserId = demoCustomer.Id,
                Label = "Flagship Residence",
                FullName = "Elena Rostova",
                PhoneNumber = "+977 9841234567",
                Province = "Bagmati Province",
                District = "Kathmandu",
                Municipality = "Kathmandu Metropolitan City",
                Ward = "01",
                Street = "Durbar Marg, Heritage Boulevard",
                Landmark = "Opposite Annapurna Luxury Arcade",
                SpecialInstructions = "Leave with concierge desk.",
                IsDefault = true
            };

            var customerUserRole = new UserRole
            {
                UserId = demoCustomer.Id,
                RoleId = customerRole.Id,
                AssignedAt = DateTimeOffset.UtcNow
            };

            await context.Users.AddRangeAsync(adminUser, demoCustomer);
            await context.StaffProfiles.AddAsync(adminStaffProfile);
            await context.CustomerProfiles.AddAsync(customerProfile);
            await context.CustomerAddresses.AddAsync(demoAddress);
            await context.UserRoles.AddRangeAsync(adminUserRole, customerUserRole);
        }

        // 2. Categories
        if (!await context.Categories.AnyAsync())
        {
            var outerwear = new Category
            {
                Id = Guid.Parse("c1111111-1111-1111-1111-111111111111"),
                Name = "Outerwear",
                Slug = "outerwear",
                Description = "Sculptural tailored coats, double-faced virgin wool trenches, and modular capes.",
                ImageUrl = "https://images.unsplash.com/photo-1544022613-e87ce7526edb?auto=format&fit=crop&w=1200&q=85",
                SortOrder = 1,
                Status = CategoryStatus.Active
            };

            var shirting = new Category
            {
                Id = Guid.Parse("c2222222-2222-2222-2222-222222222222"),
                Name = "Shirting",
                Slug = "shirting",
                Description = "Concealed-placket organic silk-poplin, oversized poplins, and architectural shirts.",
                ImageUrl = "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=85",
                SortOrder = 2,
                Status = CategoryStatus.Active
            };

            var trousers = new Category
            {
                Id = Guid.Parse("c3333333-3333-3333-3333-333333333333"),
                Name = "Trousers",
                Slug = "trousers",
                Description = "Double-pleated wool gabardine, wide-leg trousers, and structured drape silhouettes.",
                ImageUrl = "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85",
                SortOrder = 3,
                Status = CategoryStatus.Active
            };

            var knitwear = new Category
            {
                Id = Guid.Parse("c4444444-4444-4444-4444-444444444444"),
                Name = "Knitwear",
                Slug = "knitwear",
                Description = "Heavyweight ribbed cashmere, boiled wool sweaters, and architectural turtleneck knits.",
                ImageUrl = "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85",
                SortOrder = 4,
                Status = CategoryStatus.Active
            };

            var accessories = new Category
            {
                Id = Guid.Parse("c5555555-5555-5555-5555-555555555555"),
                Name = "Accessories",
                Slug = "accessories",
                Description = "Full-grain vegetable-tanned leather totes, sculptural belts, and minimal leather goods.",
                ImageUrl = "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85",
                SortOrder = 5,
                Status = CategoryStatus.Active
            };

            var footwear = new Category
            {
                Id = Guid.Parse("c6666666-6666-6666-6666-666666666666"),
                Name = "Footwear",
                Slug = "footwear",
                Description = "Architectural square-toe leather boots and minimal Goodyear-welted loafers.",
                ImageUrl = "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=85",
                SortOrder = 6,
                Status = CategoryStatus.Active
            };

            await context.Categories.AddRangeAsync(outerwear, shirting, trousers, knitwear, accessories, footwear);

            // 3. Collections
            var monolithCollection = new Collection
            {
                Id = Guid.Parse("d1111111-1111-1111-1111-111111111111"),
                Name = "Autumn / Winter Monolith",
                Slug = "autumn-winter-monolith",
                Subtitle = "Sculptural Brutalism in Double-Faced Virgin Wool & Cashmere",
                Description = "A masterclass in restraint, exploring heavy silhouettes, concealed closures, and raw textured wools.",
                BannerImageUrl = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85",
                Featured = true,
                SortOrder = 1,
                Status = CollectionStatus.Active
            };

            var permanenceCollection = new Collection
            {
                Id = Guid.Parse("d2222222-2222-2222-2222-222222222222"),
                Name = "Core Permanence",
                Slug = "core-permanence",
                Subtitle = "Seasonless Wardrobe Anchors",
                Description = "Timeless silk poplin shirting, double-pleated gabardine trousers, and everyday cashmere essentials.",
                BannerImageUrl = "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=2000&q=85",
                Featured = true,
                SortOrder = 2,
                Status = CollectionStatus.Active
            };

            await context.Collections.AddRangeAsync(monolithCollection, permanenceCollection);

            // 4. Products (Initial 8 Curated Garments)
            var p1 = new Product
            {
                Id = Guid.Parse("e1111111-1111-1111-1111-111111111111"),
                Slug = "architectural-virgin-wool-overcoat",
                Sku = "YB-AW26-001",
                Name = "Architectural Virgin Wool Overcoat",
                Description = "Tailored from double-faced Italian virgin wool with an elongated silhouette, structured drop-shoulder seam, and concealed horn button closure. Engineered for effortless layering across transitional and winter climates.",
                MaterialsAndCare = new List<string>
                {
                    "100% RWS-Certified Italian Virgin Wool (580 GSM)",
                    "Full Cupro Bemberg breathable lining",
                    "Bespoke matte buffalo horn buttons",
                    "Specialist dry clean only; press with damp cloth"
                },
                ShippingInfo = "Complimentary white-glove courier delivery within 2–4 business days. Delivered in a breathable archival cotton garment bag.",
                CategoryId = outerwear.Id,
                GenderCollection = GenderCollection.Unisex,
                CollectionTag = "Autumn / Winter Monolith",
                OriginalPrice = 48500.00m,
                SellingPrice = 42000.00m,
                DiscountPercent = 13.00m,
                MainImageUrl = "https://images.unsplash.com/photo-1544022613-e87ce7526edb?auto=format&fit=crop&w=1200&q=85",
                Featured = true,
                NewArrival = true,
                BestSeller = true,
                OnSale = true,
                Status = ProductStatus.Published,
                TotalStock = 24
            };

            p1.Images.Add(new ProductImage { ProductId = p1.Id, ImageUrl = p1.MainImageUrl, DisplayOrder = 1, AltText = "Architectural Virgin Wool Overcoat Front Silhouette" });
            p1.Sizes.Add(new ProductSize { ProductId = p1.Id, SizeName = "XS", DisplayOrder = 1 });
            p1.Sizes.Add(new ProductSize { ProductId = p1.Id, SizeName = "S", DisplayOrder = 2 });
            p1.Sizes.Add(new ProductSize { ProductId = p1.Id, SizeName = "M", DisplayOrder = 3 });
            p1.Sizes.Add(new ProductSize { ProductId = p1.Id, SizeName = "L", DisplayOrder = 4 });
            p1.Sizes.Add(new ProductSize { ProductId = p1.Id, SizeName = "XL", DisplayOrder = 5 });
            p1.Colors.Add(new ProductColor { ProductId = p1.Id, ColorName = "Obsidian Black", HexCode = "#080808" });
            p1.Colors.Add(new ProductColor { ProductId = p1.Id, ColorName = "Slate Charcoal", HexCode = "#2D2D2D" });

            p1.Variants.Add(new ProductVariant { ProductId = p1.Id, Sku = "YB-AW26-001-XS-BLK", Size = "XS", ColorName = "Obsidian Black", ColorHex = "#080808", StockQuantity = 3 });
            p1.Variants.Add(new ProductVariant { ProductId = p1.Id, Sku = "YB-AW26-001-S-BLK", Size = "S", ColorName = "Obsidian Black", ColorHex = "#080808", StockQuantity = 6 });
            p1.Variants.Add(new ProductVariant { ProductId = p1.Id, Sku = "YB-AW26-001-M-BLK", Size = "M", ColorName = "Obsidian Black", ColorHex = "#080808", StockQuantity = 8 });
            p1.Variants.Add(new ProductVariant { ProductId = p1.Id, Sku = "YB-AW26-001-L-BLK", Size = "L", ColorName = "Obsidian Black", ColorHex = "#080808", StockQuantity = 4 });
            p1.Variants.Add(new ProductVariant { ProductId = p1.Id, Sku = "YB-AW26-001-XL-CHR", Size = "XL", ColorName = "Slate Charcoal", ColorHex = "#2D2D2D", StockQuantity = 3 });

            var p2 = new Product
            {
                Id = Guid.Parse("e2222222-2222-2222-2222-222222222222"),
                Slug = "concealed-placket-silk-poplin-shirt",
                Sku = "YB-AW26-002",
                Name = "Concealed Placket Silk Poplin Shirt",
                Description = "Crisp organic cotton-silk poplin shirting cut with a sharp architectural collar, concealed front placket, and elongated French squared cuffs. Designed to hold its structure from morning studio appointments through evening engagements.",
                MaterialsAndCare = new List<string>
                {
                    "78% Organic Long-Staple Cotton, 22% Mulberry Silk",
                    "Mother-of-pearl concealed buttons reinforced with cross-stitching",
                    "Single-needle French seam construction (8 stitches per cm)",
                    "Cold gentle hand wash or eco dry clean"
                },
                ShippingInfo = "Dispatched within 24 hours in archival acid-free tissue packaging.",
                CategoryId = shirting.Id,
                GenderCollection = GenderCollection.Women,
                CollectionTag = "Core Permanence",
                OriginalPrice = 18500.00m,
                SellingPrice = 18500.00m,
                DiscountPercent = 0.00m,
                MainImageUrl = "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=85",
                Featured = true,
                NewArrival = true,
                BestSeller = false,
                OnSale = false,
                Status = ProductStatus.Published,
                TotalStock = 31
            };

            p2.Images.Add(new ProductImage { ProductId = p2.Id, ImageUrl = p2.MainImageUrl, DisplayOrder = 1, AltText = "Concealed Placket Silk Poplin Shirt Detail" });
            p2.Sizes.Add(new ProductSize { ProductId = p2.Id, SizeName = "XS", DisplayOrder = 1 });
            p2.Sizes.Add(new ProductSize { ProductId = p2.Id, SizeName = "S", DisplayOrder = 2 });
            p2.Sizes.Add(new ProductSize { ProductId = p2.Id, SizeName = "M", DisplayOrder = 3 });
            p2.Sizes.Add(new ProductSize { ProductId = p2.Id, SizeName = "L", DisplayOrder = 4 });
            p2.Colors.Add(new ProductColor { ProductId = p2.Id, ColorName = "Optic White", HexCode = "#FAFAFA" });
            p2.Colors.Add(new ProductColor { ProductId = p2.Id, ColorName = "Ecru Mist", HexCode = "#E8E6E1" });

            p2.Variants.Add(new ProductVariant { ProductId = p2.Id, Sku = "YB-AW26-002-S-WHT", Size = "S", ColorName = "Optic White", ColorHex = "#FAFAFA", StockQuantity = 10 });
            p2.Variants.Add(new ProductVariant { ProductId = p2.Id, Sku = "YB-AW26-002-M-WHT", Size = "M", ColorName = "Optic White", ColorHex = "#FAFAFA", StockQuantity = 12 });
            p2.Variants.Add(new ProductVariant { ProductId = p2.Id, Sku = "YB-AW26-002-L-ECR", Size = "L", ColorName = "Ecru Mist", ColorHex = "#E8E6E1", StockQuantity = 9 });

            await context.Products.AddRangeAsync(p1, p2);
            await context.CollectionProducts.AddAsync(new CollectionProduct { CollectionId = monolithCollection.Id, ProductId = p1.Id, DisplayOrder = 1 });
            await context.CollectionProducts.AddAsync(new CollectionProduct { CollectionId = permanenceCollection.Id, ProductId = p2.Id, DisplayOrder = 1 });
        }

        // 5. Nepal Delivery Zones
        if (!await context.DeliveryZones.AnyAsync())
        {
            var zones = new List<DeliveryZone>
            {
                new() { Province = "Bagmati Province", District = "Kathmandu", StandardCharge = 0.00m, ExpressCharge = 150.00m, EstimatedTime = "1-2 Business Days", Active = true },
                new() { Province = "Bagmati Province", District = "Lalitpur", StandardCharge = 0.00m, ExpressCharge = 150.00m, EstimatedTime = "1-2 Business Days", Active = true },
                new() { Province = "Bagmati Province", District = "Bhaktapur", StandardCharge = 0.00m, ExpressCharge = 150.00m, EstimatedTime = "1-2 Business Days", Active = true },
                new() { Province = "Gandaki Province", District = "Kaski", StandardCharge = 150.00m, ExpressCharge = 300.00m, EstimatedTime = "2-3 Business Days", Active = true },
                new() { Province = "Bagmati Province", District = "Chitwan", StandardCharge = 150.00m, ExpressCharge = 300.00m, EstimatedTime = "2-3 Business Days", Active = true },
                new() { Province = "Koshi Province", District = "Morang", StandardCharge = 150.00m, ExpressCharge = 300.00m, EstimatedTime = "2-4 Business Days", Active = true },
                new() { Province = "Lumbini Province", District = "Rupandehi", StandardCharge = 150.00m, ExpressCharge = 300.00m, EstimatedTime = "2-4 Business Days", Active = true },
                new() { Province = "Karnali Province", District = "Surkhet", StandardCharge = 250.00m, ExpressCharge = 500.00m, EstimatedTime = "4-6 Business Days", Active = true }
            };
            await context.DeliveryZones.AddRangeAsync(zones);
        }

        // 6. Promotional Coupons
        if (!await context.Coupons.AnyAsync())
        {
            var coupons = new List<Coupon>
            {
                new()
                {
                    Code = "VERA10",
                    DiscountType = CouponDiscountType.Percentage,
                    DiscountValue = 10.00m,
                    MinOrderAmount = 10000.00m,
                    MaxDiscountAmount = 5000.00m,
                    ExpiryDate = DateTimeOffset.UtcNow.AddMonths(6),
                    UsageLimit = 500,
                    UsedCount = 42,
                    Status = CouponStatus.Active
                },
                new()
                {
                    Code = "ATELIER5000",
                    DiscountType = CouponDiscountType.Fixed,
                    DiscountValue = 5000.00m,
                    MinOrderAmount = 40000.00m,
                    ExpiryDate = DateTimeOffset.UtcNow.AddMonths(3),
                    UsageLimit = 50,
                    UsedCount = 11,
                    Status = CouponStatus.Active
                }
            };
            await context.Coupons.AddRangeAsync(coupons);
        }

        // 7. Brand Settings & Payment Settings Singletons
        if (!await context.BrandSettings.AnyAsync())
        {
            await context.BrandSettings.AddAsync(new BrandSettings
            {
                Id = 1,
                BrandName = "MAISON VÉRA",
                Tagline = "Haute Prêt-à-Porter & Architecture Vestimentaire",
                Description = "A private contemporary atelier dedicated to modern minimalism, architectural tailoring, and noble natural fibers.",
                ContactEmail = "atelier@maisonvera.com",
                ContactPhone = "+977 1 4239800",
                FlagshipAddress = "Durbar Marg, Heritage Boulevard, Kathmandu, Nepal",
                AnnouncementBarText = "COMPLIMENTARY WHITE-GLOVE ATELIER DELIVERY IN KATHMANDU VALLEY",
                AnnouncementBarActive = true,
                InstagramUrl = "https://instagram.com/maisonvera",
                PinterestUrl = "https://pinterest.com/maisonvera",
                WeiboUrl = "https://weibo.com/maisonvera",
                ExpressDeliveryEnabled = true,
                FreeShippingThreshold = 10000.00m,
                UpdatedAt = DateTimeOffset.UtcNow
            });
        }

        if (!await context.PaymentGatewaySettings.AnyAsync())
        {
            await context.PaymentGatewaySettings.AddAsync(new PaymentGatewaySettings
            {
                Id = 1,
                CodEnabled = true,
                CodInstructions = "Pay securely in cash or mobile wallet QR at the moment of white-glove arrival.",
                EsewaEnabled = true,
                EsewaMerchantId = "MAISON_VERA_ESEWA_9841",
                EsewaQrImageUrl = "https://images.unsplash.com/photo-1595079672139-547104b2320e?auto=format&fit=crop&w=600&q=80",
                KhaltiEnabled = true,
                KhaltiMerchantId = "MAISON_VERA_KHL_01",
                KhaltiQrImageUrl = "https://images.unsplash.com/photo-1595079672139-547104b2320e?auto=format&fit=crop&w=600&q=80",
                FonepayEnabled = true,
                FonepayMerchantName = "MAISON VERA ATELIER PRIVATE LIMITED",
                FonepayQrImageUrl = "https://images.unsplash.com/photo-1595079672139-547104b2320e?auto=format&fit=crop&w=600&q=80",
                PaymentInstructions = "Scan the boutique QR code using your digital wallet app, transfer the exact payable sum, and upload your transaction receipt screenshot with reference ID.",
                UpdatedAt = DateTimeOffset.UtcNow
            });
        }

        // 8. Campaign Banners
        if (!await context.CampaignBanners.AnyAsync())
        {
            await context.CampaignBanners.AddAsync(new CampaignBanner
            {
                Title = "L'HIVER ARCHITECTURAL 2026",
                Subtitle = "A dialogue between brutalist proportion and pure Italian virgin wool.",
                CtaText = "Discover the Collection",
                CtaLink = "/collections/men",
                DesktopImageUrl = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85",
                MobileImageUrl = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=85",
                DisplayOrder = 1,
                Active = true
            });
        }

        await context.SaveChangesAsync();
    }
}
