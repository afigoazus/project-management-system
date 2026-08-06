import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjectDetail, getProjectTasks, createProject } from "../services/project.service";
import { CreateProjectPayload } from "../types/project.type";
import { workspaceKeys } from "@/features/workspace/hooks/workspace.hook";

export const projectKeys = {
  all: ["projects"] as const,
  detail: (id: string) => [...projectKeys.all, "detail", id] as const,
  tasks: (id: string) => [...projectKeys.all, "tasks", id] as const,
};

export function useProjectDetail(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => getProjectDetail(id),
    enabled: !!id,
  });
}

export function useProjectTasks(id: string) {
  return useQuery({
    queryKey: projectKeys.tasks(id),
    queryFn: () => getProjectTasks(id),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectPayload) => createProject(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.detail(variables.workspaceId),
      });
    },
  });
}
