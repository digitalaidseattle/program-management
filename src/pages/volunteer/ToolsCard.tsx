
// material-ui
import { ConfirmationDialog } from '@digitalaidseattle/mui';
import { MenuItem } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { CARD_HEADER_SX } from '.';
import { toggleVolunteer2ToolExpertFlag } from '../../actions/ToggleVolunteer2ToolExpertFlag';
import { ListCard } from '../../components/ListCard';
import { ManagedListCard } from '../../components/ManagedListCard';
import SelectItemDialog from '../../components/SelectItemDialog';
import { EntityProps } from '../../components/utils';
import { Tool, toolService } from '../../services/dasToolsService';
import { Volunteer2Tool, volunteer2ToolService } from '../../services/dasVolunteer2ToolService';
import { Volunteer } from '../../services/dasVolunteerService';
import { SupabaseStorage } from '../../services/supabaseStorage';

const storage = new SupabaseStorage();

export const ToolsCard: React.FC<EntityProps<Volunteer>> = ({ entity, onChange }) => {
  const [current, setCurrent] = useState<Volunteer2Tool[]>([]);
  const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
  const [tools, setTools] = useState<Tool[]>([]);
  const [available, setAvailable] = useState<Tool[]>([]);
  const [cards, setCards] = useState<ReactNode[]>([]);
  const [selectedItem, setSelectedItem] = useState<Tool>();

  const navigate = useNavigate();

  useEffect(() => {
    if (entity) {
      toolService.getAll()
        .then(tools => setTools(tools));
      volunteer2ToolService.findByVolunteerId(entity.id)
        .then((tools) => setCurrent(tools));
    }
  }, [entity]);

  useEffect(() => {
    const currentIds = current.map(t => t.tool_id);
    setAvailable(tools
      .filter(t => !currentIds.includes(t.id))
      .sort((t1, t2) => t1.name.localeCompare(t2.name)))
  }, [tools, current]);

  useEffect(() => {
    setCards(createCards(current))
  }, [current]);

  function createCards(items: Volunteer2Tool[]) {
    return items
      .map(v2t => {
        const tool = v2t.tool!;
        return <ListCard
          key={v2t.tool_id}
          title={v2t.tool!.name}
          avatarImageSrc={storage.getUrl(`logos/${v2t.tool_id}`)}
          
          highlightOptions={{
            title: "Expert",
            highlight: v2t.expert ?? false,
            toggleHighlight: () => {
              return toggleVolunteer2ToolExpertFlag(v2t)
                .then(data => {
                  onChange(data);
                  return true;
                })
            }
          }}
          menuItems={[
            <MenuItem onClick={() => handleOpen(tool.id)}> Open</MenuItem >,
            <MenuItem onClick={() => {
              setSelectedItem(tool);
              setOpenConfirmation(true);
            }}>Remove...</MenuItem>]
          }
        />
      })
  }

  function handleOpen(discipline_id: string): void {
    navigate(`/tool/${discipline_id}`)
  }

  function handleAdd(selected: string | null | undefined) {
    const tool = available.find(t => t.id === selected);
    volunteer2ToolService.addToolToVolunteer(tool!, entity)
      .then(data => onChange(data))
      .finally(() => setShowAddDialog(false))
  }


  function handleRemoveConfirm(): void {
    if (selectedItem) {
      volunteer2ToolService.removeToolFromVolunteer(selectedItem, entity)
        .then(data => {
          onChange(data);
          return true;
        })
    }
  }

  return (< >
    <ManagedListCard
      title='Tools'
      items={cards}
      cardHeaderSx={CARD_HEADER_SX}
      onAdd={() => setShowAddDialog(true)}
    />
    <SelectItemDialog
      open={showAddDialog}
      options={{ title: 'Add Tool' }}
      records={available.map(v => ({ label: v.name, value: v.id }))}
      onSubmit={handleAdd}
      onCancel={() => setShowAddDialog(false)} />
    <ConfirmationDialog
      title="Confirm removing this tool"
      open={openConfirmation}
      message={"Are you sure?"}
      handleConfirm={handleRemoveConfirm}
      handleCancel={() => setOpenConfirmation(false)} />
  </>)
}
