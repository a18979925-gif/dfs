'use client';

import { useTeam } from '../TeamProvider';

export function usePresence() {
  const { members, logActivity } = useTeam();

  return {
    members,
    updateStatus: (userId: string, status: any, workingOn?: string) => {
      logActivity(userId, 'changed status to', `${status} (${workingOn || 'no details'})`);
    },
  };
}
