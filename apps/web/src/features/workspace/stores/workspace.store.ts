import { create } from "zustand";

interface WorkspaceUIState {
  isCreateModalOpen: boolean;
  isAddMemberModalOpen: boolean;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openAddMemberModal: () => void;
  closeAddMemberModal: () => void;
}

export const useWorkspaceStore = create<WorkspaceUIState>((set) => ({
  isCreateModalOpen: false,
  isAddMemberModalOpen: false,
  openCreateModal: () => set({ isCreateModalOpen: true }),
  closeCreateModal: () => set({ isCreateModalOpen: false }),
  openAddMemberModal: () => set({ isAddMemberModalOpen: true }),
  closeAddMemberModal: () => set({ isAddMemberModalOpen: false }),
}));
