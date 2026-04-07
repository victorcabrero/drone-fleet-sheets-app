import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    ok: true,
    message: 'Guardado simulado correctamente. Sustituye /api/mock por tu Apps Script para persistir en Google Sheets.'
  });
}
