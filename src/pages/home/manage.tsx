import { Button } from "@/components/ui/button";
import { Flex } from "@/components/ui/container";
import { Tab } from "@/components/ui/tab";
import useProject from "@/hooks/useProject";
import { useState } from "react";

export default function ProjectManagerPage() {
  const [currentTab, setCurrentTab] = useState('')

  const closeProject = useProject(s => s.close)

  return (
    <Flex direction="col" className="min-h-full gap-4">
      <Flex className="justify-between p-2">
        <Flex>
          <Tab.Root defaultValue="stats" onChange={setCurrentTab} >
            <Tab.Element id="stats">
              Stats
            </Tab.Element>
            <Tab.Element id="languages">
              Languages
            </Tab.Element>
          </Tab.Root>
        </Flex>
        
        <Flex>
          <Button variant={"success"}>
            Export
          </Button>
          <Button variant="danger" onClick={() => closeProject()}>
            Close
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
