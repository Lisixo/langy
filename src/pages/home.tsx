import useProject from "@/hooks/useProject";
import { useMemo } from "react";
import ProjectManagerPage from "./home/manage";
import HomeStartPage from "./home/startpage";

export default function HomePrePage() {
  const project = useProject()

  const isLoaded = useMemo(() => !!project.projectId, [project.projectId])

  if(isLoaded) 
    return <ProjectManagerPage />
  else
    return <HomeStartPage />
}