
// material-ui
import { ConfirmationDialog } from '@digitalaidseattle/mui';
import { Chip, MenuItem, Stack } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { CARD_HEADER_SX } from '.';
import { removeToolFromTeam } from '../../actions/RemoveToolFromTeam';
import { ListCard } from '../../components/ListCard';
import { ManagedListCard } from '../../components/ManagedListCard';
import { EntityProps } from '../../components/utils';
import { Team2Tool, team2ToolService } from '../../services/dasTeam2ToolService';
import { Team } from '../../services/dasTeamService';
import { Tool, toolService } from '../../services/dasToolsService';
import { SupabaseStorage } from '../../services/supabaseStorage';

const storage = new SupabaseStorage();

const STATUS_COMP: { [key: string]: JSX.Element } = {
  'active': <Chip label='Active' color='primary' />,
  'inactive': <Chip label='Inactive' color='default' />
}
export const ToolsCard: React.FC<EntityProps<Team>> = ({ entity, onChange }) => {
  const [current, setCurrent] = useState<Team2Tool[]>([]);
  const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
  const [tools, setTools] = useState<Tool[]>([]);
  const [available, setAvailable] = useState<Tool[]>([]);
  const [cards, setCards] = useState<ReactNode[]>([]);
  const [selectedItem, setSelectedItem] = useState<Tool>();

  const navigate = useNavigate();

  useEffect(() => {
    toolService.getAll()
      .then(tools => setTools(tools));
  }, []);

  useEffect(() => {
    if (entity) {
      refresh();
    }
  }, [entity]);

  useEffect(() => {
    const currentIds = current.map(t => t.tool_id);
    setAvailable(tools
      .filter(t => !currentIds.includes(t.id))
      .sort((t1, t2) => t1.name.localeCompare(t2.name)))
    setCards(createCards(current))
  }, [tools, current]);

  function refresh() {
    team2ToolService.findByTeamId(entity.id)
      .then(t2ts => {
        setCurrent(t2ts.sort((t1, t2) => t1.tool!.name.localeCompare(t2.tool!.name)));
      })
  }

  function createCards(items: Team2Tool[]) {
    return items
      .map(v2t => {
        const tool = v2t.tool!;
        return <ListCard
          key={v2t.tool_id}
          title={v2t.tool!.name}
          avatarImageSrc={storage.getUrl(`logos/${v2t.tool_id}`)}
          menuItems={[
            <MenuItem onClick={() => handleOpen(tool.id)}> Open</MenuItem >,
            <MenuItem onClick={() => {
              setSelectedItem(tool);
              setOpenConfirmation(true);
            }}>Remove...</MenuItem>]
          }
          cardContent={
            <Stack>
              {STATUS_COMP[tool.status]}
            </Stack>
          }
        />
      })
  }

  function handleChange(data: any) {
    refresh();
    onChange(data)
  }

  function handleOpen(tool_id: string): void {
    navigate(`/tool/${tool_id}`)
  }

  function handleAdd(value: string | null | undefined): void {
    const selected = available.find(vol => vol.id === value);
    if (selected) {
      team2ToolService.addToolToTeam(selected, entity!)
        .then(() => handleChange(true))
    }
  }

  function handleRemove(): void {
    if (selectedItem) {
      removeToolFromTeam(selectedItem, entity!)
        .then(data => {
          handleChange(data);
          setOpenConfirmation(false);
        })
    }
  }

  return (
    < >
      <ManagedListCard
        title='Tools'
        cardHeaderSx={CARD_HEADER_SX}
        items={cards}
        addOpts={{
          title: 'Add tool',
          available: available.map(tool => ({ label: tool.name, value: tool.id })),
          handleAdd: handleAdd
        }}
      />
      <ConfirmationDialog
        title="Confirm removing this tools"
        open={openConfirmation}
        message={"Are you sure?"}
        handleConfirm={handleRemove}
        handleCancel={() => setOpenConfirmation(false)} />
    </>)
}