import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

interface InvoiceData {
  vendor_name: string;
  amount: number;
  due_date: Date;
  description: string;
  paid: boolean;
  userId: number;
}

const randomAmount = (min = 50, max = 2000) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

const randomDate = (start: Date, end: Date) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
};

const generateInvoiceData = (userId: number, count: number): InvoiceData[] => {
  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Retail',
    'Manufacturing',
    'Consulting',
    'Marketing',
    'Real Estate',
    'Food Service',
  ];

  const vendors = [
    'Acme Corp',
    'Globex',
    'Initech',
    'Umbrella Corp',
    'Stark Industries',
    'Wayne Enterprises',
    'Cyberdyne Systems',
    'Soylent Corp',
    'Massive Dynamic',
    'Hooli',
    'Pied Piper',
    'Dunder Mifflin',
    'Los Pollos Hermanos',
    'Oceanic Airlines',
    'Sterling Cooper',
    'Bluth Company',
    'Vandelay Industries',
    'Prestige Worldwide',
    'Wernham Hogg',
    'Gekko & Co',
    'Nakatomi Trading',
    'Weyland-Yutani',
    'Tyrell Corp',
    'Oscorp',
    'Alias Investigations',
    'Cheers Bar',
    'Paper Street Soap',
    'Beneke Fabricators',
    'Krusty Krab',
    'Wonka Industries',
  ];

  const descriptions = [
    'Consulting services',
    'Software license',
    'Hardware purchase',
    'Cloud services',
    'Marketing services',
    'Office supplies',
    'IT support',
    'Training services',
    'Maintenance contract',
    'Legal services',
    'Accounting services',
    'Design services',
    'Security services',
    'Cleaning services',
    'Subscription fees',
    'Equipment rental',
    'Travel expenses',
    'Professional development',
    'Advertising',
    'Insurance premium',
    'Facilities maintenance',
    'Shipping costs',
    'Printing services',
    'Telecommunications',
    'Utilities',
    'Research services',
    'Recruitment services',
    'Event planning',
    'Content creation',
    'Building lease',
  ];

  const startDate = new Date('2024-01-01');
  const endDate = new Date('2026-12-31');

  const invoices: InvoiceData[] = [];

  for (let i = 0; i < count; i++) {
    const dueDate = randomDate(startDate, endDate);
    const createdDate = new Date(dueDate);
    createdDate.setMonth(
      createdDate.getMonth() - Math.floor(Math.random() * 3) - 1,
    );

    const vendor = vendors[Math.floor(Math.random() * vendors.length)];
    const industry = industries[Math.floor(Math.random() * industries.length)];
    const description =
      descriptions[Math.floor(Math.random() * descriptions.length)] +
      ` (${industry})`;

    invoices.push({
      vendor_name: vendor,
      amount: randomAmount(),
      due_date: dueDate,
      description: description,
      paid: Math.random() > 0.3,
      userId: userId,
    });
  }

  return invoices;
};

async function main(): Promise<void> {
  const passwordHash: string = await argon2.hash('password123');

  const user = await prisma.user.upsert({
    where: { email: 'demo@altametrics.com' },
    update: {},
    create: {
      email: 'demo@altametrics.com',
      name: 'Demo User',
      password: passwordHash,
    },
  });

  await prisma.invoice.deleteMany({});

  const invoiceData = generateInvoiceData(user.id, 100);
  await prisma.invoice.createMany({
    data: invoiceData,
  });

  console.log('Seeding completed successfully!');
}

async function run(): Promise<void> {
  try {
    await main();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
