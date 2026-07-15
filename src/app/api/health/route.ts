import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      service: 'transientlabs',
      commit: process.env.RENDER_GIT_COMMIT ?? 'local',
      uptimeSeconds: Math.floor(process.uptime()),
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  );
}
