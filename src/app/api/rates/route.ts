import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Default fallback rates in case DB is empty
const defaultRates = {
  USD: 1,
  INR: 83.5,
  GBP: 0.79,
  EUR: 0.92
};

export async function GET() {
  try {
    const ratesFromDb = await prisma.exchangeRate.findMany();
    
    const rates: Record<string, number> = { ...defaultRates };
    
    // Override with DB values
    ratesFromDb.forEach(r => {
      rates[r.currency] = r.rate;
    });

    return NextResponse.json(rates);
  } catch (error) {
    console.error("Failed to fetch rates", error);
    return NextResponse.json(defaultRates);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { currency, rate } = body;

    if (!currency || !rate) {
      return NextResponse.json({ error: "Missing currency or rate" }, { status: 400 });
    }

    const updatedRate = await prisma.exchangeRate.upsert({
      where: { currency: currency.toUpperCase() },
      update: { rate: parseFloat(rate) },
      create: { currency: currency.toUpperCase(), rate: parseFloat(rate) }
    });

    return NextResponse.json({ message: "Rate updated successfully", updatedRate });
  } catch (error) {
    console.error("Failed to update rate", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
