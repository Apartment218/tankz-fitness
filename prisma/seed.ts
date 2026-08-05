import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  BookingStatus,
  MemberStatus,
  MembershipStatus,
  PaymentMethod,
  PaymentStatus,
  PrismaClient,
  StaffRole,
} from "../lib/generated/prisma/client";

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DIRECT_URL or DATABASE_URL is missing from .env");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.classSession.deleteMany();
  await prisma.fitnessClass.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.membershipPlan.deleteMany();
  await prisma.member.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.product.deleteMany();

  const bronzePlan = await prisma.membershipPlan.create({
    data: {
      name: "Bronze",
      description: "Gym access during staffed hours.",
      price: 24.99,
      durationDays: 30,
    },
  });

  const silverPlan = await prisma.membershipPlan.create({
    data: {
      name: "Silver",
      description: "Full gym access and selected classes.",
      price: 34.99,
      durationDays: 30,
    },
  });

  const goldPlan = await prisma.membershipPlan.create({
    data: {
      name: "Gold",
      description: "Full access to the gym and all group classes.",
      price: 49.99,
      durationDays: 30,
    },
  });

  const vipPlan = await prisma.membershipPlan.create({
    data: {
      name: "VIP",
      description: "Premium access with priority booking.",
      price: 69.99,
      durationDays: 30,
    },
  });

  const trainer = await prisma.staff.create({
    data: {
      firstName: "Daniel",
      lastName: "Taylor",
      email: "daniel@tankzfitness.co.uk",
      phone: "07123 456789",
      role: StaffRole.TRAINER,
    },
  });

  await prisma.staff.create({
    data: {
      firstName: "Olivia",
      lastName: "Clark",
      email: "olivia@tankzfitness.co.uk",
      phone: "07123 555555",
      role: StaffRole.MANAGER,
    },
  });

  const memberData = [
    {
      firstName: "John",
      lastName: "Smith",
      email: "john@example.com",
      phone: "07111 111111",
      status: MemberStatus.ACTIVE,
      plan: goldPlan,
      joinedAt: new Date("2026-01-12"),
    },
    {
      firstName: "Sarah",
      lastName: "Jones",
      email: "sarah@example.com",
      phone: "07222 222222",
      status: MemberStatus.ACTIVE,
      plan: silverPlan,
      joinedAt: new Date("2026-02-04"),
    },
    {
      firstName: "Michael",
      lastName: "Brown",
      email: "michael@example.com",
      phone: "07333 333333",
      status: MemberStatus.INACTIVE,
      plan: bronzePlan,
      joinedAt: new Date("2025-11-18"),
    },
    {
      firstName: "Emma",
      lastName: "Wilson",
      email: "emma@example.com",
      phone: "07444 444444",
      status: MemberStatus.ACTIVE,
      plan: vipPlan,
      joinedAt: new Date("2026-03-22"),
    },
    {
      firstName: "James",
      lastName: "Walker",
      email: "james@example.com",
      phone: "07555 555555",
      status: MemberStatus.ACTIVE,
      plan: goldPlan,
      joinedAt: new Date("2026-04-09"),
    },
    {
      firstName: "Sophie",
      lastName: "Evans",
      email: "sophie@example.com",
      phone: "07666 666666",
      status: MemberStatus.SUSPENDED,
      plan: silverPlan,
      joinedAt: new Date("2026-04-28"),
    },
    {
      firstName: "Luke",
      lastName: "Harris",
      email: "luke@example.com",
      phone: "07777 777777",
      status: MemberStatus.ACTIVE,
      plan: bronzePlan,
      joinedAt: new Date("2026-05-15"),
    },
    {
      firstName: "Grace",
      lastName: "Thomas",
      email: "grace@example.com",
      phone: "07888 888888",
      status: MemberStatus.ACTIVE,
      plan: vipPlan,
      joinedAt: new Date("2026-06-01"),
    },
    {
      firstName: "Ryan",
      lastName: "Roberts",
      email: "ryan@example.com",
      phone: "07999 999999",
      status: MemberStatus.CANCELLED,
      plan: bronzePlan,
      joinedAt: new Date("2025-10-03"),
    },
    {
      firstName: "Chloe",
      lastName: "Lewis",
      email: "chloe@example.com",
      phone: "07000 000000",
      status: MemberStatus.ACTIVE,
      plan: goldPlan,
      joinedAt: new Date("2026-06-20"),
    },
  ];

  const members = [];

  for (const item of memberData) {
    const member = await prisma.member.create({
      data: {
        firstName: item.firstName,
        lastName: item.lastName,
        email: item.email,
        phone: item.phone,
        status: item.status,
        joinedAt: item.joinedAt,
        memberships: {
          create: {
            planId: item.plan.id,
            status:
              item.status === MemberStatus.CANCELLED
                ? MembershipStatus.CANCELLED
                : item.status === MemberStatus.INACTIVE
                  ? MembershipStatus.EXPIRED
                  : MembershipStatus.ACTIVE,
            startDate: item.joinedAt,
            endDate: new Date("2027-12-31"),
          },
        },
      },
    });

    members.push(member);
  }

  const strengthClass = await prisma.fitnessClass.create({
    data: {
      name: "Strength Training",
      description: "A full-body strength and conditioning session.",
      durationMin: 60,
      capacity: 16,
    },
  });

  const hiitClass = await prisma.fitnessClass.create({
    data: {
      name: "HIIT",
      description: "High-intensity interval training.",
      durationMin: 45,
      capacity: 20,
    },
  });

  const yogaClass = await prisma.fitnessClass.create({
    data: {
      name: "Mobility & Yoga",
      description: "Mobility, flexibility and recovery work.",
      durationMin: 50,
      capacity: 18,
    },
  });

  const sessionOne = await prisma.classSession.create({
    data: {
      classId: strengthClass.id,
      trainerId: trainer.id,
      startsAt: new Date("2026-07-27T09:00:00"),
      endsAt: new Date("2026-07-27T10:00:00"),
      capacity: 16,
      room: "Studio 1",
    },
  });

  const sessionTwo = await prisma.classSession.create({
    data: {
      classId: hiitClass.id,
      trainerId: trainer.id,
      startsAt: new Date("2026-07-27T18:00:00"),
      endsAt: new Date("2026-07-27T18:45:00"),
      capacity: 20,
      room: "Studio 2",
    },
  });

  await prisma.classSession.create({
    data: {
      classId: yogaClass.id,
      trainerId: trainer.id,
      startsAt: new Date("2026-07-28T10:30:00"),
      endsAt: new Date("2026-07-28T11:20:00"),
      capacity: 18,
      room: "Studio 1",
    },
  });

  await prisma.booking.createMany({
    data: [
      {
        memberId: members[0].id,
        sessionId: sessionOne.id,
        status: BookingStatus.CONFIRMED,
      },
      {
        memberId: members[1].id,
        sessionId: sessionOne.id,
        status: BookingStatus.CONFIRMED,
      },
      {
        memberId: members[3].id,
        sessionId: sessionTwo.id,
        status: BookingStatus.CONFIRMED,
      },
      {
        memberId: members[4].id,
        sessionId: sessionTwo.id,
        status: BookingStatus.WAITLISTED,
      },
    ],
  });

  await prisma.payment.createMany({
    data: [
      {
        memberId: members[0].id,
        amount: 49.99,
        currency: "GBP",
        status: PaymentStatus.PAID,
        method: PaymentMethod.CARD,
        reference: "PAY-1001",
        description: "Gold membership",
        paidAt: new Date("2026-07-01"),
      },
      {
        memberId: members[1].id,
        amount: 34.99,
        currency: "GBP",
        status: PaymentStatus.PAID,
        method: PaymentMethod.DIRECT_DEBIT,
        reference: "PAY-1002",
        description: "Silver membership",
        paidAt: new Date("2026-07-02"),
      },
      {
        memberId: members[3].id,
        amount: 69.99,
        currency: "GBP",
        status: PaymentStatus.PENDING,
        method: PaymentMethod.CARD,
        reference: "PAY-1003",
        description: "VIP membership",
      },
    ],
  });

  await prisma.product.createMany({
    data: [
      {
        name: "Tankz Fitness T-Shirt",
        description: "Black branded training T-shirt.",
        price: 19.99,
        stock: 25,
        sku: "TF-TSHIRT-BLK",
      },
      {
        name: "Protein Shaker",
        description: "700ml Tankz Fitness shaker.",
        price: 8.99,
        stock: 40,
        sku: "TF-SHAKER",
      },
      {
        name: "Resistance Band Set",
        description: "Set of five resistance bands.",
        price: 14.99,
        stock: 18,
        sku: "TF-BANDS",
      },
    ],
  });

  console.log("Tankz Fitness sample data created successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });