'use client';

import { useState } from 'react';

export function useScreenShare() {
  const [isSharing, setIsSharing] = useState(false);

  return {
    isSharing,
    setSharingStatus: (status: boolean) => setIsSharing(status),
  };
}
