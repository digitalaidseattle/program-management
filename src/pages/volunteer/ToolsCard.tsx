
// material-ui
import { ConfirmationDialog } from '@digitalaidseattle/mui';
import { MenuItem } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { CARD_HEADER_SX } from '.';
import { toggleVolunteer2ToolExpertFlag } from '../../actions/ToggleVolunteer2ToolExpertFlag';
import { ListCard } from '../../components/ListCard';
import { ManagedListCard } from '../../components/ManagedListCard';
import { EntityPropsOpt } from '../../components/utils';
import { Tool, toolService } from '../../services/dasToolsService';
import { Volunteer2Tool, volunteer2ToolService } from '../../services/dasVolunteer2ToolService';
import { Volunteer } from '../../services/dasVolunteerService';

export const ToolsCard: React.FC<EntityPropsOpt<Volunteer>> = ({ entity, onChange }) => {
  const [current, setCurrent] = useState<Volunteer2Tool[]>([]);
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
  }, [tools, current]);

  useEffect(() => {
    setCards(createCards(current))
  }, [current]);

  function refresh() {
    volunteer2ToolService.findByVolunteerId(entity.id)
      .then((tools) => setCurrent(tools));
  }

  function createCards(items: Volunteer2Tool[]) {
    return items
      .map(v2t => {
        const tool = v2t.tool!;
        return <ListCard
          key={v2t.tool_id}
          title={v2t.tool!.name}
          avatarImageSrc={toolService.getLogoUrl(v2t.tool!)}

          highlightOptions={{
            title: "Expert",
            highlight: v2t.expert ?? false,
            toggleHighlight: () => {
              onChange && toggleVolunteer2ToolExpertFlag(v2t)
                .then(data => handleChange(data))
            }
          }}
          menuItems={[
            <MenuItem key={0} onClick={() => handleOpen(tool.id)}> Open</MenuItem >,
            <MenuItem key={1} onClick={() => {
              setSelectedItem(tool);
              setOpenConfirmation(true);
            }}>Remove...</MenuItem>]
          }
        />
      })
  }

  function handleOpen(discipline_id: string): void {
    navigate(`/tools/${discipline_id}`)
  }

  function handleChange(data: any) {
    refresh();
    onChange!(data)
  }

  function handleAdd(selected: string | null | undefined): void {
    const tool = available.find(t => t.id === selected);
    volunteer2ToolService.addToolToVolunteer(tool!, entity)
      .then(() => handleChange(true))
  }

  function handleRemoveConfirm(): void {
    if (selectedItem) {
      volunteer2ToolService.removeToolFromVolunteer(selectedItem, entity)
        .then(() => handleChange(true))
    }
  }

  return (< >
    <ManagedListCard
      title='Tools'
      items={cards}
      headerSx={CARD_HEADER_SX}
      addOpts={onChange && {
        title: 'Add Tool',
        available: available.map(v => ({ label: v.name, value: v.id })),
        handleAdd: handleAdd
      }}
    />
    <ConfirmationDialog
      title="Confirm removing this tool"
      open={openConfirmation}
      message={"Are you sure?"}
      handleConfirm={handleRemoveConfirm}
      handleCancel={() => setOpenConfirmation(false)} />
  </>)
}
