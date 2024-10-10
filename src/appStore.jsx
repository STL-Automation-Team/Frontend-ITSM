import { create } from 'zustand';
import { persist } from 'zustand/middleware';
const useAppStore = create(
  persist(
    (set) => ({
      dopen: true,
      updateOpen: (dopen) => set((state) => ({ dopen })),
    }),
    { name: 'my_app_store' }
  )
);
export default useAppStore;