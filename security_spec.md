# Security Specification - Vrr

## Data Invariants
1. **Products**: Must have a valid name, price, and category. Only admins can write.
2. **Categories**: Must have a unique slug. Only admins can write.
3. **Journal Posts**: Must have valid title and content. Only admins can write.
4. **Settings**: Global singleton. Only admins can write.
5. **Orders**: Users can only see their own orders. Admin can see all orders.

## The Dirty Dozen Payloads (Target: DENIED)
1. **Unauthenticated Write**: Trying to create a product without being logged in.
2. **Privilege Escalation**: Logged-in user trying to set themselves as an admin.
3. **Shadow Update**: Adding a `hiddenPrice` field to a product.
4. **ID Poisoning**: Creating a product with a 2MB string as ID.
5. **PII Leak**: Regular user trying to list all orders (which contains emails).
6. **State Shortcut**: User trying to change an order status from "processing" to "delivered".
7. **Relational Sync Failure**: Creating an order without any items.
8. **Invalid Types**: Setting product price as a boolean.
9. **Timestamp Spoofing**: Setting `createdAt` to a future date manually.
10. **Admin Mimicry**: Authenticated non-admin user trying to update global settings.
11. **Orphaned Writes**: Creating a product with a non-existent category ID.
12. **Recursive Cost Attack**: Making a list query that requires thousands of lookups.

## Test Runner
I will implement `firestore.rules.test.ts` to verify these.
