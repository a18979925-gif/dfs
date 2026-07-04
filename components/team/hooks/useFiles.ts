'use client';

import { useTeam } from '../TeamProvider';

export function useFiles() {
  const { files, addFile, toggleFavoriteFile, addVersion } = useTeam();

  return {
    files,
    uploadFile: (name: string, size: string) => addFile({ name, size }),
    toggleFav: (id: string) => toggleFavoriteFile(id),
    uploadNewVersion: (id: string, name: string, size: string) => addVersion(id, name, size),
  };
}
