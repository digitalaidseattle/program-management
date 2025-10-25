
// material-ui
import { useEffect, useState } from 'react';
import { CARD_HEADER_SX } from '.';
import { ManagedListCard } from '../../components/ManagedListCard';
import SelectVolunteerDialog from '../../components/SelectVolunteerDialog';
import { EntityProps } from '../../components/utils';
import { team2ToolService } from '../../services/dasTeam2ToolService';
import { Team } from '../../services/dasTeamService';
import { Tool, toolService } from '../../services/dasToolsService';
import { ToolCard } from './ToolCard';

export const ToolsCard: React.FC<EntityProps<Team>> = ({ entity, onChange }) => {
  const [current, setCurrent] = useState<Tool[]>([]);
  const [available, setAvailable] = useState<Tool[]>([]);
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);

  useEffect(() => {
    if (entity) {
      toolService.getAll()
        .then((active) => {
          team2ToolService.findToolsByTeamId(entity.id)
            .then(tools => {
              setCurrent(tools);
              const teamToolIds = tools.map(tool => tool.id) ?? [];
              const temp = active
                .filter(tool => !teamToolIds.includes(tool.id))
                .sort((t1, t2) => t1.name.localeCompare(t2.name))
              setAvailable(temp)
            })
        });
    }
  }, [entity]);

  function handleRemove(index: number): Promise<boolean> {
    return team2ToolService.removeToolFromTeam(current[index], entity!)
      .then(() => {
        onChange(true);
        return true;
      })
  }

  function handleAdd(value: string | null | undefined): Promise<boolean> {
    const selected = available.find(vol => vol.id === value);
    if (selected) {
      return team2ToolService.addToolToTeam(selected, entity!)
        .then(() => {
          onChange(true);
          setShowAddDialog(false);
          return true;
        })
    } else {
      return Promise.resolve(true)
    }
  }

  return (
    < >
      <ManagedListCard
        title='Tools'
        cardHeaderSx={CARD_HEADER_SX}
        items={current.map(vol => <ToolCard key={vol.id}
          entity={vol}
          cardStyles={{ width: 200 }} />)}
        onAdd={() => setShowAddDialog(true)}
        onDelete={handleRemove}
      />
      <SelectVolunteerDialog
        open={showAddDialog}
        options={{ title: 'Add tool' }}
        records={available.map(tool => ({ label: tool.name, value: tool.id }))}
        onSubmit={handleAdd}
        onCancel={() => setShowAddDialog(false)} />
    </>)
}