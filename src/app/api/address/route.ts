import { NextResponse } from 'next/server';
import data from './data.mock.json';

export async function GET() {
  return NextResponse.json(data);
}
