using System;
using System.IO;
using System.Text;
using ClothingStore.Infrastructure.Identity;
using Xunit;
using Xunit.Abstractions;

namespace ClothingStore.UnitTests;

public class GenerateSeedSqlTests
{
    private readonly ITestOutputHelper _output;

    public GenerateSeedSqlTests(ITestOutputHelper output)
    {
        _output = output;
    }

    [Fact]
    public void BuildCompleteSupabaseSetupSql()
    {
        var dir = AppContext.BaseDirectory;
        string schemaPath = "";
        while (!string.IsNullOrEmpty(dir))
        {
            var candidate = Path.Combine(dir, "backend", "supabase_schema.sql");
            if (File.Exists(candidate))
            {
                schemaPath = candidate;
                break;
            }
            var candidateDirect = Path.Combine(dir, "supabase_schema.sql");
            if (File.Exists(candidateDirect))
            {
                schemaPath = candidateDirect;
                break;
            }
            dir = Path.GetDirectoryName(dir);
        }

        var schemaContent = File.ReadAllText(schemaPath);

        var hasher = new Argon2PasswordHasher();
        var adminHash = hasher.HashPassword("Admin123!");
        var userHash = hasher.HashPassword("Password123!");

        var sb = new StringBuilder();
        sb.AppendLine("-- =============================================================================");
        sb.AppendLine("-- MAISON VÉRA — FULL SUPABASE POSTGRESQL SCHEMA & SEED DATA SETUP SCRIPT");
        sb.AppendLine("-- Executes idempotently to create all 28 tables, constraints, indexes, and full catalog.");
        sb.AppendLine("-- =============================================================================");
        sb.AppendLine();
        sb.AppendLine(schemaContent);
        sb.AppendLine();
        sb.AppendLine("-- =============================================================================");
        sb.AppendLine("-- INITIAL SEED DATA (EXACT POSTGRESQL TABLE CASING & REQUIRED ATTRIBUTES)");
        sb.AppendLine("-- =============================================================================");
        sb.AppendLine();

        // 1. Roles (table name is lowercase `roles`)
        sb.AppendLine("-- 1. ROLES");
        sb.AppendLine(@"
INSERT INTO roles (""Id"", ""Name"", ""NormalizedName"", ""Description"", ""IsSystemRole"", ""CreatedAt"", ""UpdatedAt"") VALUES
('11111111-1111-1111-1111-111111111111', 'Super Admin', 'SUPER ADMIN', 'Unrestricted authority across all atelier modules and security systems.', true, NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'Admin', 'ADMIN', 'Full operational control over catalog, orders, and clients.', true, NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'Order Manager', 'ORDER MANAGER', 'Dispatches, manages logistics, and updates order states.', true, NOW(), NOW()),
('44444444-4444-4444-4444-444444444444', 'Product Manager', 'PRODUCT MANAGER', 'Manages garment catalog, releases, and inventory allocations.', true, NOW(), NOW()),
('55555555-5555-5555-5555-555555555555', 'Payment Manager', 'PAYMENT MANAGER', 'Reviews and verifies manual digital wallet payments and bank statements.', true, NOW(), NOW()),
('66666666-6666-6666-6666-666666666666', 'Customer Support', 'CUSTOMER SUPPORT', 'Manages inquiries, customer dossiers, and review moderation.', true, NOW(), NOW()),
('77777777-7777-7777-7777-777777777777', 'Customer', 'CUSTOMER', 'Private atelier client purchasing garments and accessing client portal.', true, NOW(), NOW())
ON CONFLICT (""Id"") DO NOTHING;
");

        // 2. Users (table name is lowercase `users`)
        sb.AppendLine("-- 2. USERS (Super Admin & Demo Client)");
        sb.AppendLine($@"
INSERT INTO users (""Id"", ""Email"", ""NormalizedEmail"", ""PhoneNumber"", ""PasswordHash"", ""SecurityStamp"", ""ConcurrencyStamp"", ""UserType"", ""IsActive"", ""EmailConfirmed"", ""PhoneConfirmed"", ""TwoFactorEnabled"", ""LockoutEnabled"", ""AccessFailedCount"", ""CreatedAt"", ""UpdatedAt"", ""IsDeleted"") VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'admin@maisonvera.com', 'ADMIN@MAISONVERA.COM', '+977 1 4239800', '{adminHash}', gen_random_uuid()::text, gen_random_uuid()::text, 'Admin', true, true, true, false, false, 0, NOW(), NOW(), false),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aarav.shrestha@atelier.np', 'AARAV.SHRESTHA@ATELIER.NP', '+977 9801122334', '{userHash}', gen_random_uuid()::text, gen_random_uuid()::text, 'Customer', true, true, true, false, false, 0, NOW(), NOW(), false)
ON CONFLICT (""Id"") DO NOTHING;

INSERT INTO staff_profiles (""UserId"", ""FullName"", ""EmployeeCode"", ""Department"", ""LastActiveAt"", ""UpdatedAt"") VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Maison Véra Atelier Director', 'MV-DIR-001', 'Executive Directorate', NOW(), NOW())
ON CONFLICT (""UserId"") DO NOTHING;

INSERT INTO customer_profiles (""UserId"", ""FullName"", ""AvatarUrl"", ""JoinedDate"", ""TotalOrders"", ""TotalSpent"", ""VipTier"", ""InternalNotes"", ""UpdatedAt"") VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Aarav Shrestha', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', NOW() - INTERVAL '3 months', 3, 98500.00, 'Private Atelier', 'Prefers double-faced cashmere and architectural wool coats in size 48 / M.', NOW())
ON CONFLICT (""UserId"") DO NOTHING;

INSERT INTO customer_addresses (""Id"", ""UserId"", ""Label"", ""FullName"", ""PhoneNumber"", ""Province"", ""District"", ""Municipality"", ""Ward"", ""Street"", ""Landmark"", ""SpecialInstructions"", ""IsDefault"", ""CreatedAt"", ""UpdatedAt"") VALUES
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Flagship Residence', 'Aarav Shrestha', '+977 9801122334', 'Bagmati Province', 'Kathmandu', 'Kathmandu Metropolitan City', '01', 'Durbar Marg, Heritage Boulevard', 'Opposite Annapurna Luxury Arcade', 'Leave with concierge desk.', true, NOW(), NOW())
ON CONFLICT (""Id"") DO NOTHING;

INSERT INTO user_roles (""UserId"", ""RoleId"", ""AssignedAt"") VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '77777777-7777-7777-7777-777777777777', NOW())
ON CONFLICT DO NOTHING;
");

        // 3. Categories (table name is lowercase `categories`)
        sb.AppendLine("-- 3. CATEGORIES");
        sb.AppendLine(@"
INSERT INTO categories (""Id"", ""Name"", ""Slug"", ""Description"", ""ImageUrl"", ""SortOrder"", ""Status"", ""CreatedAt"", ""UpdatedAt"", ""IsDeleted"") VALUES
('c1111111-1111-1111-1111-111111111111', 'Outerwear', 'outerwear', 'Architectural wool overcoats, storm trenches, and structured cold-weather silhouettes.', 'https://images.unsplash.com/photo-1544022613-e87ce7526edb?auto=format&fit=crop&w=1200&q=85', 1, 'Active', NOW(), NOW(), false),
('c2222222-2222-2222-2222-222222222222', 'Shirting', 'shirting', 'Concealed-placket silk poplins, crisp organic cotton shirts, and draped tunics.', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=85', 2, 'Active', NOW(), NOW(), false),
('c3333333-3333-3333-3333-333333333333', 'Tailoring & Trousers', 'tailoring', 'Double-pleated worsted flannel trousers, unlined blazers, and precision suiting.', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85', 3, 'Active', NOW(), NOW(), false),
('c4444444-4444-4444-4444-444444444444', 'Knitwear', 'knitwear', 'Heavy-gauge Inner Mongolian cashmere turtlenecks and sculpted merino pullovers.', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85', 4, 'Active', NOW(), NOW(), false),
('c5555555-5555-5555-5555-555555555555', 'Leather Goods', 'leather-goods', 'Full-grain Italian Box calfskin totes, architectural folios, and minimalist accessories.', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85', 5, 'Active', NOW(), NOW(), false)
ON CONFLICT (""Id"") DO NOTHING;
");

        // 4. Collections (table name is lowercase `collections`)
        sb.AppendLine("-- 4. COLLECTIONS");
        sb.AppendLine(@"
INSERT INTO collections (""Id"", ""Name"", ""Slug"", ""Subtitle"", ""Description"", ""BannerImageUrl"", ""Featured"", ""SortOrder"", ""Status"", ""CreatedAt"", ""UpdatedAt"", ""IsDeleted"") VALUES
('d1111111-1111-1111-1111-111111111111', 'Autumn / Winter Monolith', 'autumn-winter-monolith', 'Collection 04 — Architectural Forms in Obsidian & Chalk', 'An exploration of brutalist geometry softened through double-faced virgin wool and 5-gauge cashmere.', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85', true, 1, 'Active', NOW(), NOW(), false),
('d2222222-2222-2222-2222-222222222222', 'Core Permanence', 'core-permanence', 'Foundational Wardrobe Archetypes', 'Seasonless garments engineered to remain in continuous production—refined millimeter by millimeter.', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=2000&q=85', true, 2, 'Active', NOW(), NOW(), false),
('d3333333-3333-3333-3333-333333333333', 'Atelier Editions', 'atelier-editions', 'Small-Batch Numbered Artisanal Releases', 'Limited runs crafted in our flagship studio from deadstock Japanese and Italian archival textiles.', 'https://images.unsplash.com/photo-1544022613-e87ce7526edb?auto=format&fit=crop&w=2000&q=85', false, 3, 'Active', NOW(), NOW(), false)
ON CONFLICT (""Id"") DO NOTHING;
");

        // 5. Products (table name is lowercase `products`)
        sb.AppendLine("-- 5. PRODUCTS (8 CURATED GARMENTS)");
        sb.AppendLine(@"
INSERT INTO products (""Id"", ""Slug"", ""Sku"", ""Name"", ""Description"", ""MaterialsAndCare"", ""ShippingInfo"", ""CategoryId"", ""GenderCollection"", ""CollectionTag"", ""OriginalPrice"", ""SellingPrice"", ""DiscountPercent"", ""MainImageUrl"", ""Featured"", ""NewArrival"", ""BestSeller"", ""OnSale"", ""Status"", ""TotalStock"", ""ConcurrencyToken"", ""CreatedAt"", ""UpdatedAt"", ""IsDeleted"") VALUES
('e1111111-1111-1111-1111-111111111111', 'architectural-virgin-wool-overcoat', 'YB-AW26-001', 'Architectural Virgin Wool Overcoat', 'Tailored from double-faced Italian virgin wool with an elongated silhouette, structured drop-shoulder seam, and concealed horn button closure.', '[""100% RWS-Certified Italian Virgin Wool (580 GSM)"", ""Full Cupro Bemberg breathable lining"", ""Bespoke matte buffalo horn buttons"", ""Specialist dry clean only""]'::jsonb, 'Complimentary white-glove courier delivery within 2–4 business days.', 'c1111111-1111-1111-1111-111111111111', 'Unisex', 'Autumn / Winter Monolith', 48500.00, 42000.00, 13.00, 'https://images.unsplash.com/photo-1544022613-e87ce7526edb?auto=format&fit=crop&w=1200&q=85', true, true, true, true, 'Published', 24, gen_random_uuid(), NOW(), NOW(), false),
('e2222222-2222-2222-2222-222222222222', 'concealed-placket-silk-poplin-shirt', 'YB-AW26-002', 'Concealed Placket Silk Poplin Shirt', 'Crisp organic cotton-silk poplin shirting cut with a sharp architectural collar, concealed front placket, and elongated French squared cuffs.', '[""78% Organic Long-Staple Cotton, 22% Mulberry Silk"", ""Mother-of-pearl concealed buttons"", ""Single-needle French seam construction""]'::jsonb, 'Dispatched within 24 hours in archival acid-free tissue packaging.', 'c2222222-2222-2222-2222-222222222222', 'Women', 'Core Permanence', 18500.00, 18500.00, 0.00, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=85', true, true, false, false, 'Published', 31, gen_random_uuid(), NOW(), NOW(), false),
('e3333333-3333-3333-3333-333333333333', 'double-pleated-flannel-wide-trousers', 'YB-AW26-003', 'Double-Pleated Flannel Wide Trousers', 'High-waisted wide-leg tailored trousers featuring deep forward double pleats, side-tab waist adjusters in matte calfskin, and a fluid drape.', '[""100% Super 130s Worsted Wool Flannel"", ""Half-lined to the knee in smooth viscose twill"", ""Calfskin side waist tabs""]'::jsonb, 'Complimentary hemming alteration voucher included with every trouser order.', 'c3333333-3333-3333-3333-333333333333', 'Men', 'Core Permanence', 26000.00, 26000.00, 0.00, 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85', true, false, true, false, 'Published', 19, gen_random_uuid(), NOW(), NOW(), false),
('e4444444-4444-4444-4444-444444444444', 'heavy-gauge-ribbed-cashmere-turtleneck', 'YB-AW26-004', 'Heavy-Gauge Ribbed Cashmere Turtleneck', 'Knitted in 5-gauge 4-ply Inner Mongolian cashmere with an enveloping fold-over rib collar and relaxed architectural silhouette.', '[""100% Grade-A Inner Mongolian Cashmere (15.2 micron)"", ""Fully-fashioned linked seams"", ""Includes cedarwood storage block""]'::jsonb, 'Ships in a signature matte black rigid gift box.', 'c4444444-4444-4444-4444-444444444444', 'Women', 'Autumn / Winter Monolith', 36000.00, 31500.00, 12.00, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85', true, true, false, true, 'Published', 15, gen_random_uuid(), NOW(), NOW(), false),
('e5555555-5555-5555-5555-555555555555', 'monolith-calfskin-architectural-tote', 'YB-AW26-005', 'Monolith Calfskin Architectural Tote', 'Hand-constructed from full-grain matte Box calfskin with raw hand-painted edges, internal padded laptop compartment, and rolled top handles.', '[""100% Full-Grain Italian Box Calfskin"", ""Suede-lined interior"", ""Hand-painted edge glazing""]'::jsonb, 'Includes numbered authenticity card and heavyweight organic canvas dust bag.', 'c5555555-5555-5555-5555-555555555555', 'Unisex', 'Core Permanence', 44000.00, 44000.00, 0.00, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85', true, true, true, false, 'Published', 7, gen_random_uuid(), NOW(), NOW(), false),
('e6666666-6666-6666-6666-666666666666', 'deconstructed-single-breasted-wool-blazer', 'YB-AW26-006', 'Deconstructed Single-Breasted Wool Blazer', 'Unlined half-canvas blazer crafted from high-twist dry virgin wool crepe with elongated notch lapels and functional surgeon cuffs.', '[""100% High-Twist Virgin Wool Crepe"", ""Natural horsehair chest canvas"", ""Horn buttons""]'::jsonb, 'Complimentary delivery with wooden anatomical hanger included.', 'c3333333-3333-3333-3333-333333333333', 'Men', 'Autumn / Winter Monolith', 39500.00, 34000.00, 14.00, 'https://images.unsplash.com/photo-1544022613-e87ce7526edb?auto=format&fit=crop&w=1200&q=85', false, true, false, true, 'Published', 11, gen_random_uuid(), NOW(), NOW(), false),
('e7777777-7777-7777-7777-777777777777', 'asymmetrical-draped-cupro-tunic-shirt', 'YB-AW26-007', 'Asymmetrical Draped Cupro Tunic Shirt', 'Fluid Japanese cupro-silk tunic shirt featuring an off-center wrap placket, mandarin stand collar, and side vents for layering.', '[""85% Japanese Bemberg Cupro, 15% Silk"", ""Sand-washed matte finish"", ""Gentle cold hand wash""]'::jsonb, 'Standard and express courier dispatch available.', 'c2222222-2222-2222-2222-222222222222', 'Unisex', 'Atelier Editions', 21000.00, 17500.00, 17.00, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=85', false, false, true, true, 'Published', 5, gen_random_uuid(), NOW(), NOW(), false),
('e8888888-8888-8888-8888-888888888888', 'sculpted-merino-mock-neck-pullover', 'YB-AW26-008', 'Sculpted Merino Mock-Neck Pullover', 'Fine 14-gauge extrafine merino wool pullover engineered with architectural darting at the shoulder and elongated rib-knit cuffs.', '[""100% ZQ-Certified Extrafine Merino Wool"", ""Naturally breathable and odor-resistant"", ""Hand wash cold""]'::jsonb, 'Dispatched within 1–2 business days.', 'c4444444-4444-4444-4444-444444444444', 'Men', 'Core Permanence', 22500.00, 22500.00, 0.00, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85', false, true, true, false, 'Published', 28, gen_random_uuid(), NOW(), NOW(), false)
ON CONFLICT (""Id"") DO NOTHING;

-- Collection Products Mappings (table name is lowercase `collection_products`)
INSERT INTO collection_products (""CollectionId"", ""ProductId"", ""DisplayOrder"") VALUES
('d1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', 1),
('d1111111-1111-1111-1111-111111111111', 'e4444444-4444-4444-4444-444444444444', 2),
('d1111111-1111-1111-1111-111111111111', 'e6666666-6666-6666-6666-666666666666', 3),
('d2222222-2222-2222-2222-222222222222', 'e2222222-2222-2222-2222-222222222222', 1),
('d2222222-2222-2222-2222-222222222222', 'e3333333-3333-3333-3333-333333333333', 2),
('d2222222-2222-2222-2222-222222222222', 'e5555555-5555-5555-5555-555555555555', 3),
('d2222222-2222-2222-2222-222222222222', 'e8888888-8888-8888-8888-888888888888', 4),
('d3333333-3333-3333-3333-333333333333', 'e1111111-1111-1111-1111-111111111111', 1),
('d3333333-3333-3333-3333-333333333333', 'e7777777-7777-7777-7777-777777777777', 2)
ON CONFLICT DO NOTHING;
");

        // 6. Product Variants, Sizes, Colors, Images
        sb.AppendLine("-- 6. PRODUCT SIZES, COLORS, IMAGES & VARIANTS");
        sb.AppendLine(@"
-- Product Sizes
INSERT INTO ""ProductSizes"" (""Id"", ""ProductId"", ""SizeName"", ""DisplayOrder"") VALUES
(gen_random_uuid(), 'e1111111-1111-1111-1111-111111111111', 'XS', 1),
(gen_random_uuid(), 'e1111111-1111-1111-1111-111111111111', 'S', 2),
(gen_random_uuid(), 'e1111111-1111-1111-1111-111111111111', 'M', 3),
(gen_random_uuid(), 'e1111111-1111-1111-1111-111111111111', 'L', 4),
(gen_random_uuid(), 'e1111111-1111-1111-1111-111111111111', 'XL', 5),
(gen_random_uuid(), 'e2222222-2222-2222-2222-222222222222', 'XS', 1),
(gen_random_uuid(), 'e2222222-2222-2222-2222-222222222222', 'S', 2),
(gen_random_uuid(), 'e2222222-2222-2222-2222-222222222222', 'M', 3),
(gen_random_uuid(), 'e2222222-2222-2222-2222-222222222222', 'L', 4),
(gen_random_uuid(), 'e3333333-3333-3333-3333-333333333333', 'S', 1),
(gen_random_uuid(), 'e3333333-3333-3333-3333-333333333333', 'M', 2),
(gen_random_uuid(), 'e3333333-3333-3333-3333-333333333333', 'L', 3),
(gen_random_uuid(), 'e3333333-3333-3333-3333-333333333333', 'XL', 4),
(gen_random_uuid(), 'e4444444-4444-4444-4444-444444444444', 'XS', 1),
(gen_random_uuid(), 'e4444444-4444-4444-4444-444444444444', 'S', 2),
(gen_random_uuid(), 'e4444444-4444-4444-4444-444444444444', 'M', 3),
(gen_random_uuid(), 'e4444444-4444-4444-4444-444444444444', 'L', 4),
(gen_random_uuid(), 'e5555555-5555-5555-5555-555555555555', 'ONE SIZE', 1),
(gen_random_uuid(), 'e6666666-6666-6666-6666-666666666666', 'S', 1),
(gen_random_uuid(), 'e6666666-6666-6666-6666-666666666666', 'M', 2),
(gen_random_uuid(), 'e6666666-6666-6666-6666-666666666666', 'L', 3),
(gen_random_uuid(), 'e6666666-6666-6666-6666-666666666666', 'XL', 4),
(gen_random_uuid(), 'e7777777-7777-7777-7777-777777777777', 'XS', 1),
(gen_random_uuid(), 'e7777777-7777-7777-7777-777777777777', 'S', 2),
(gen_random_uuid(), 'e7777777-7777-7777-7777-777777777777', 'M', 3),
(gen_random_uuid(), 'e7777777-7777-7777-7777-777777777777', 'L', 4),
(gen_random_uuid(), 'e8888888-8888-8888-8888-888888888888', 'S', 1),
(gen_random_uuid(), 'e8888888-8888-8888-8888-888888888888', 'M', 2),
(gen_random_uuid(), 'e8888888-8888-8888-8888-888888888888', 'L', 3),
(gen_random_uuid(), 'e8888888-8888-8888-8888-888888888888', 'XL', 4)
ON CONFLICT DO NOTHING;

-- Product Colors
INSERT INTO ""ProductColors"" (""Id"", ""ProductId"", ""ColorName"", ""HexCode"") VALUES
(gen_random_uuid(), 'e1111111-1111-1111-1111-111111111111', 'Obsidian Black', '#080808'),
(gen_random_uuid(), 'e1111111-1111-1111-1111-111111111111', 'Slate Charcoal', '#2D2D2D'),
(gen_random_uuid(), 'e2222222-2222-2222-2222-222222222222', 'Optic White', '#FAFAFA'),
(gen_random_uuid(), 'e2222222-2222-2222-2222-222222222222', 'Ecru Mist', '#E8E6E1'),
(gen_random_uuid(), 'e3333333-3333-3333-3333-333333333333', 'Anthracite Grey', '#383838'),
(gen_random_uuid(), 'e3333333-3333-3333-3333-333333333333', 'Obsidian Black', '#080808'),
(gen_random_uuid(), 'e4444444-4444-4444-4444-444444444444', 'Obsidian Black', '#080808'),
(gen_random_uuid(), 'e4444444-4444-4444-4444-444444444444', 'Bone Ivory', '#EAE8E1'),
(gen_random_uuid(), 'e5555555-5555-5555-5555-555555555555', 'Obsidian Black', '#080808'),
(gen_random_uuid(), 'e6666666-6666-6666-6666-666666666666', 'Obsidian Black', '#080808'),
(gen_random_uuid(), 'e7777777-7777-7777-7777-777777777777', 'Chalk White', '#F9F9F8'),
(gen_random_uuid(), 'e7777777-7777-7777-7777-777777777777', 'Obsidian Black', '#080808'),
(gen_random_uuid(), 'e8888888-8888-8888-8888-888888888888', 'Obsidian Black', '#080808'),
(gen_random_uuid(), 'e8888888-8888-8888-8888-888888888888', 'Anthracite Grey', '#383838')
ON CONFLICT DO NOTHING;

-- Product Images
INSERT INTO ""ProductImages"" (""Id"", ""ProductId"", ""ImageUrl"", ""DisplayOrder"", ""AltText"", ""CreatedAt"") VALUES
(gen_random_uuid(), 'e1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1544022613-e87ce7526edb?auto=format&fit=crop&w=1200&q=85', 1, 'Architectural Virgin Wool Overcoat Front Silhouette', NOW()),
(gen_random_uuid(), 'e2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=85', 1, 'Concealed Placket Silk Poplin Shirt Detail', NOW()),
(gen_random_uuid(), 'e3333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85', 1, 'Double-Pleated Flannel Wide Trousers', NOW()),
(gen_random_uuid(), 'e4444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85', 1, 'Heavy-Gauge Ribbed Cashmere Turtleneck', NOW()),
(gen_random_uuid(), 'e5555555-5555-5555-5555-555555555555', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85', 1, 'Monolith Calfskin Architectural Tote', NOW()),
(gen_random_uuid(), 'e6666666-6666-6666-6666-666666666666', 'https://images.unsplash.com/photo-1544022613-e87ce7526edb?auto=format&fit=crop&w=1200&q=85', 1, 'Deconstructed Single-Breasted Wool Blazer', NOW()),
(gen_random_uuid(), 'e7777777-7777-7777-7777-777777777777', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=85', 1, 'Asymmetrical Draped Cupro Tunic Shirt', NOW()),
(gen_random_uuid(), 'e8888888-8888-8888-8888-888888888888', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85', 1, 'Sculpted Merino Mock-Neck Pullover', NOW())
ON CONFLICT DO NOTHING;

-- Product Variants (table name is lowercase `product_variants`)
INSERT INTO product_variants (""Id"", ""ProductId"", ""Sku"", ""Size"", ""ColorName"", ""ColorHex"", ""StockQuantity"", ""LowStockThreshold"", ""IsActive"", ""CreatedAt"", ""UpdatedAt"") VALUES
(gen_random_uuid(), 'e1111111-1111-1111-1111-111111111111', 'YB-AW26-001-XS-BLK', 'XS', 'Obsidian Black', '#080808', 3, 2, true, NOW(), NOW()),
(gen_random_uuid(), 'e1111111-1111-1111-1111-111111111111', 'YB-AW26-001-S-BLK', 'S', 'Obsidian Black', '#080808', 6, 2, true, NOW(), NOW()),
(gen_random_uuid(), 'e1111111-1111-1111-1111-111111111111', 'YB-AW26-001-M-BLK', 'M', 'Obsidian Black', '#080808', 8, 2, true, NOW(), NOW()),
(gen_random_uuid(), 'e1111111-1111-1111-1111-111111111111', 'YB-AW26-001-L-BLK', 'L', 'Obsidian Black', '#080808', 4, 2, true, NOW(), NOW()),
(gen_random_uuid(), 'e1111111-1111-1111-1111-111111111111', 'YB-AW26-001-XL-CHR', 'XL', 'Slate Charcoal', '#2D2D2D', 3, 2, true, NOW(), NOW()),
(gen_random_uuid(), 'e2222222-2222-2222-2222-222222222222', 'YB-AW26-002-S-WHT', 'S', 'Optic White', '#FAFAFA', 10, 3, true, NOW(), NOW()),
(gen_random_uuid(), 'e2222222-2222-2222-2222-222222222222', 'YB-AW26-002-M-WHT', 'M', 'Optic White', '#FAFAFA', 12, 3, true, NOW(), NOW()),
(gen_random_uuid(), 'e2222222-2222-2222-2222-222222222222', 'YB-AW26-002-L-ECR', 'L', 'Ecru Mist', '#E8E6E1', 9, 3, true, NOW(), NOW()),
(gen_random_uuid(), 'e3333333-3333-3333-3333-333333333333', 'YB-AW26-003-S-GRY', 'S', 'Anthracite Grey', '#383838', 4, 2, true, NOW(), NOW()),
(gen_random_uuid(), 'e3333333-3333-3333-3333-333333333333', 'YB-AW26-003-M-GRY', 'M', 'Anthracite Grey', '#383838', 7, 2, true, NOW(), NOW()),
(gen_random_uuid(), 'e3333333-3333-3333-3333-333333333333', 'YB-AW26-003-L-GRY', 'L', 'Anthracite Grey', '#383838', 5, 2, true, NOW(), NOW()),
(gen_random_uuid(), 'e3333333-3333-3333-3333-333333333333', 'YB-AW26-003-XL-BLK', 'XL', 'Obsidian Black', '#080808', 3, 2, true, NOW(), NOW()),
(gen_random_uuid(), 'e4444444-4444-4444-4444-444444444444', 'YB-AW26-004-XS-BLK', 'XS', 'Obsidian Black', '#080808', 3, 2, true, NOW(), NOW()),
(gen_random_uuid(), 'e4444444-4444-4444-4444-444444444444', 'YB-AW26-004-S-BLK', 'S', 'Obsidian Black', '#080808', 5, 2, true, NOW(), NOW()),
(gen_random_uuid(), 'e4444444-4444-4444-4444-444444444444', 'YB-AW26-004-M-BLK', 'M', 'Obsidian Black', '#080808', 4, 2, true, NOW(), NOW()),
(gen_random_uuid(), 'e4444444-4444-4444-4444-444444444444', 'YB-AW26-004-L-IVR', 'L', 'Bone Ivory', '#EAE8E1', 3, 2, true, NOW(), NOW()),
(gen_random_uuid(), 'e5555555-5555-5555-5555-555555555555', 'YB-AW26-005-OS-BLK', 'ONE SIZE', 'Obsidian Black', '#080808', 7, 2, true, NOW(), NOW()),
(gen_random_uuid(), 'e6666666-6666-6666-6666-666666666666', 'YB-AW26-006-S-BLK', 'S', 'Obsidian Black', '#080808', 2, 2, true, NOW(), NOW()),
(gen_random_uuid(), 'e6666666-6666-6666-6666-666666666666', 'YB-AW26-006-M-BLK', 'M', 'Obsidian Black', '#080808', 4, 2, true, NOW(), NOW()),
(gen_random_uuid(), 'e6666666-6666-6666-6666-666666666666', 'YB-AW26-006-L-BLK', 'L', 'Obsidian Black', '#080808', 3, 2, true, NOW(), NOW()),
(gen_random_uuid(), 'e6666666-6666-6666-6666-666666666666', 'YB-AW26-006-XL-BLK', 'XL', 'Obsidian Black', '#080808', 2, 2, true, NOW(), NOW()),
(gen_random_uuid(), 'e7777777-7777-7777-7777-777777777777', 'YB-AW26-007-XS-WHT', 'XS', 'Chalk White', '#F9F9F8', 1, 2, true, NOW(), NOW()),
(gen_random_uuid(), 'e7777777-7777-7777-7777-777777777777', 'YB-AW26-007-S-WHT', 'S', 'Chalk White', '#F9F9F8', 2, 2, true, NOW(), NOW()),
(gen_random_uuid(), 'e7777777-7777-7777-7777-777777777777', 'YB-AW26-007-M-BLK', 'M', 'Obsidian Black', '#080808', 2, 2, true, NOW(), NOW()),
(gen_random_uuid(), 'e8888888-8888-8888-8888-888888888888', 'YB-AW26-008-S-BLK', 'S', 'Obsidian Black', '#080808', 7, 3, true, NOW(), NOW()),
(gen_random_uuid(), 'e8888888-8888-8888-8888-888888888888', 'YB-AW26-008-M-BLK', 'M', 'Obsidian Black', '#080808', 10, 3, true, NOW(), NOW()),
(gen_random_uuid(), 'e8888888-8888-8888-8888-888888888888', 'YB-AW26-008-L-BLK', 'L', 'Obsidian Black', '#080808', 6, 3, true, NOW(), NOW()),
(gen_random_uuid(), 'e8888888-8888-8888-8888-888888888888', 'YB-AW26-008-XL-GRY', 'XL', 'Anthracite Grey', '#383838', 5, 2, true, NOW(), NOW())
ON CONFLICT DO NOTHING;
");

        // 7. Delivery Zones (table name is lowercase `delivery_zones`)
        sb.AppendLine("-- 7. NEPAL TIERED DELIVERY ZONES");
        sb.AppendLine(@"
INSERT INTO delivery_zones (""Id"", ""Province"", ""District"", ""StandardCharge"", ""ExpressCharge"", ""EstimatedTime"", ""Active"", ""CreatedAt"", ""UpdatedAt"") VALUES
(gen_random_uuid(), 'Bagmati Province', 'Kathmandu', 0.00, 150.00, '1-2 Business Days', true, NOW(), NOW()),
(gen_random_uuid(), 'Bagmati Province', 'Lalitpur', 0.00, 150.00, '1-2 Business Days', true, NOW(), NOW()),
(gen_random_uuid(), 'Bagmati Province', 'Bhaktapur', 0.00, 150.00, '1-2 Business Days', true, NOW(), NOW()),
(gen_random_uuid(), 'Gandaki Province', 'Kaski', 150.00, 300.00, '2-3 Business Days', true, NOW(), NOW()),
(gen_random_uuid(), 'Bagmati Province', 'Chitwan', 150.00, 300.00, '2-3 Business Days', true, NOW(), NOW()),
(gen_random_uuid(), 'Koshi Province', 'Morang', 150.00, 300.00, '2-4 Business Days', true, NOW(), NOW()),
(gen_random_uuid(), 'Lumbini Province', 'Rupandehi', 150.00, 300.00, '2-4 Business Days', true, NOW(), NOW()),
(gen_random_uuid(), 'Karnali Province', 'Surkhet', 250.00, 500.00, '4-6 Business Days', true, NOW(), NOW())
ON CONFLICT DO NOTHING;
");

        // 8. Coupons (table name is lowercase `coupons`)
        sb.AppendLine("-- 8. PROMOTIONAL COUPONS");
        sb.AppendLine(@"
INSERT INTO coupons (""Id"", ""Code"", ""DiscountType"", ""DiscountValue"", ""MinOrderAmount"", ""MaxDiscountAmount"", ""ExpiryDate"", ""UsageLimit"", ""UsedCount"", ""Status"", ""CreatedAt"", ""UpdatedAt"", ""IsDeleted"") VALUES
(gen_random_uuid(), 'VERA10', 'Percentage', 10.00, 10000.00, 5000.00, NOW() + INTERVAL '6 months', 500, 42, 'Active', NOW(), NOW(), false),
(gen_random_uuid(), 'ATELIER5000', 'Fixed', 5000.00, 40000.00, NULL, NOW() + INTERVAL '3 months', 50, 11, 'Active', NOW(), NOW(), false)
ON CONFLICT (""Code"") DO NOTHING;
");

        // 9. Brand & Payment Settings (lowercase `brand_settings`, `payment_gateway_settings`)
        sb.AppendLine("-- 9. BRAND SETTINGS & PAYMENT GATEWAY SETTINGS");
        sb.AppendLine(@"
INSERT INTO brand_settings (""Id"", ""BrandName"", ""Tagline"", ""Description"", ""ContactEmail"", ""ContactPhone"", ""FlagshipAddress"", ""AnnouncementBarText"", ""AnnouncementBarActive"", ""InstagramUrl"", ""PinterestUrl"", ""WeiboUrl"", ""ExpressDeliveryEnabled"", ""FreeShippingThreshold"", ""UpdatedAt"") VALUES
(1, 'MAISON VÉRA', 'Haute Prêt-à-Porter & Architecture Vestimentaire', 'A private contemporary atelier dedicated to modern minimalism, architectural tailoring, and noble natural fibers.', 'atelier@maisonvera.com', '+977 1 4239800', 'Durbar Marg, Heritage Boulevard, Kathmandu, Nepal', 'COMPLIMENTARY WHITE-GLOVE ATELIER DELIVERY IN KATHMANDU VALLEY', true, 'https://instagram.com/maisonvera', 'https://pinterest.com/maisonvera', 'https://weibo.com/maisonvera', true, 10000.00, NOW())
ON CONFLICT (""Id"") DO UPDATE SET
""BrandName"" = EXCLUDED.""BrandName"",
""AnnouncementBarText"" = EXCLUDED.""AnnouncementBarText"";

INSERT INTO payment_gateway_settings (""Id"", ""CodEnabled"", ""CodInstructions"", ""EsewaEnabled"", ""EsewaMerchantId"", ""EsewaQrImageUrl"", ""KhaltiEnabled"", ""KhaltiMerchantId"", ""KhaltiQrImageUrl"", ""FonepayEnabled"", ""FonepayMerchantName"", ""FonepayQrImageUrl"", ""PaymentInstructions"", ""UpdatedAt"") VALUES
(1, true, 'Pay securely in cash or mobile wallet QR at the moment of white-glove arrival.', true, 'MAISON_VERA_ESEWA_9841', 'https://images.unsplash.com/photo-1595079672139-547104b2320e?auto=format&fit=crop&w=600&q=80', true, 'MAISON_VERA_KHL_01', 'https://images.unsplash.com/photo-1595079672139-547104b2320e?auto=format&fit=crop&w=600&q=80', true, 'MAISON VERA ATELIER PRIVATE LIMITED', 'https://images.unsplash.com/photo-1595079672139-547104b2320e?auto=format&fit=crop&w=600&q=80', 'Scan the boutique QR code using your digital wallet app, transfer the exact payable sum, and upload your transaction receipt screenshot with reference ID.', NOW())
ON CONFLICT (""Id"") DO UPDATE SET
""CodEnabled"" = EXCLUDED.""CodEnabled"",
""EsewaEnabled"" = EXCLUDED.""EsewaEnabled"";
");

        // 10. Campaign Banners (table name is `"CampaignBanners"`)
        sb.AppendLine("-- 10. CAMPAIGN BANNERS");
        sb.AppendLine(@"
INSERT INTO ""CampaignBanners"" (""Id"", ""Title"", ""Subtitle"", ""CtaText"", ""CtaLink"", ""DesktopImageUrl"", ""MobileImageUrl"", ""DisplayOrder"", ""Active"", ""CreatedAt"", ""UpdatedAt"", ""IsDeleted"") VALUES
(gen_random_uuid(), 'L''HIVER ARCHITECTURAL 2026', 'A dialogue between brutalist proportion and pure Italian virgin wool.', 'Discover the Collection', '/collections/men', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=85', 1, true, NOW(), NOW(), false)
ON CONFLICT DO NOTHING;

");

        var outputPath = Path.Combine(Path.GetDirectoryName(schemaPath)!, "supabase_setup_and_seed.sql");

        File.WriteAllText(outputPath, sb.ToString(), Encoding.UTF8);
        _output.WriteLine($"SUCCESS: Wrote master SQL setup and seed script to {outputPath}");
        Assert.True(File.Exists(outputPath));
    }
}
