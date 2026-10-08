import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length === 0) {
      return NextResponse.json({ error: 'Empty buffer received' }, { status: 400 });
    }

    const publicModelsDir = path.join(process.cwd(), 'public', 'models');
    if (!fs.existsSync(publicModelsDir)) {
      fs.mkdirSync(publicModelsDir, { recursive: true });
    }

    const filePath = path.join(publicModelsDir, 'heart.glb');
    fs.writeFileSync(filePath, buffer);

    console.log(`[CardioVision 3D] Saved model successfully to ${filePath} (${buffer.length} bytes)`);
    return NextResponse.json({ success: true, bytes: buffer.length, path: '/models/heart.glb' });
  } catch (err: any) {
    console.error('[CardioVision 3D] Failed to save heart.glb:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
