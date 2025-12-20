import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { ConfirmationDialog, InputForm, InputOption } from '@digitalaidseattle/mui';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Stack,
  Tooltip
} from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel, Toolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { storageService } from '../../App';
import { EditField } from '../../components/EditField';
import { UploadImage } from '../../components/UploadImage';
import { EntityProps } from '../../components/utils';
import { Contact, Partner, partnerService } from '../../services/dasPartnerService';
import { profileService } from '../../services/dasProfileService';
import { removeContact } from '../../actions/RemoveContact';
import ContactDialog from './ContactDialog';
import { addContact } from '../../actions/AddContact';
import { updateContact } from '../../actions/UpdateContact';

const ContactsTable = ({ entity: partner, onChange }: EntityProps<Partner>) => {

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>();
  const [selectedContact, setSelectedContact] = useState<Contact>();
  const [isNew, setIsNew] = useState<boolean>(false);

  useEffect(() => {
    if (partner) {
      setContacts(partner.contact ?? []);
    }
  }, [partner]);

  const getColumns = (): GridColDef[] => {
    return [
      {
        field: 'id',
        headerName: 'Photo',
        width: 100,
        renderCell: (params) => (
          <Avatar
            src={profileService.getPicUrl(params.row)!}
            alt={partner.name}
            sx={{
              width: '40',
              height: '40',
            }}
          />
        ),
      },
      {
        field: 'name',
        headerName: 'Name',
        width: 250
      },
      {
        field: 'title',
        headerName: 'Title',
        width: 250
      },
      {
        field: 'email',
        headerName: 'Email',
        width: 250
      }
    ]
  }

  function customToolbar() {
    return <Toolbar>
      <Box sx={{ flex: 1, display: 'flex', gap: 1 }}>
        <Tooltip title="Add Contact">
          <IconButton color="primary" onClick={() => {
            setSelectedContact(
              {
                ...profileService.empty(),
                title: ''
              })
            setIsNew(true);
            setShowDialog(true);
          }} >
            <PlusCircleOutlined />
          </IconButton>
        </Tooltip>
        <Tooltip title="Remove Contacts">
          <span>
            <IconButton color="primary"
              disabled={selectionModel?.ids!.size === 0} onClick={() => setShowConfirm(true)} >
              <DeleteOutlined /> {selectionModel?.ids!.entries()}
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Toolbar>
  }

  function handleConfirm(): void {
    const toRemove = contacts
      .filter(contact => selectionModel?.ids.has(contact.id));
    Promise.all(toRemove.map(contact => removeContact(contact)))
      .then(() => onChange(partner))
      .finally(() => setShowConfirm(false))
  }

  function handleChange(changes: any): void {
    if (changes) {
      if (isNew) {
        addContact(partner, changes.contact, changes.picture)
          .then(() => onChange(partner));
      } else {
        updateContact(partner, changes.contact, changes.picture)
          .then(() => onChange(partner));
      }
    }
    setShowDialog(false);
  }

  return <>
    <DataGrid
      rows={contacts}
      slots={{ toolbar: customToolbar }}
      columns={getColumns()}
      showToolbar={true}
      checkboxSelection={true}
      rowSelectionModel={selectionModel}
      onRowSelectionModelChange={setSelectionModel}
      onRowDoubleClick={(params) => {
        setSelectedContact(params.row);
        setIsNew(false);
        setShowDialog(true);
      }}
    />
    <ConfirmationDialog
      message={'Are you sure?'}
      open={showConfirm}
      handleConfirm={handleConfirm}
      handleCancel={() => setShowConfirm(false)} />
    <ContactDialog
      title={isNew ? 'New Contact' : 'Update Contact'}
      open={showDialog}
      entity={selectedContact!}
      onChange={handleChange} />
  </>
}

const PartnerDetails: React.FC<EntityProps<Partner>> = ({ entity: partner, onChange }) => {
  const fields = [
    { name: 'name', label: 'Name', type: 'string' },
    { name: 'website', label: 'Website', type: 'string' },
    {
      name: 'status', label: 'Status', type: 'select',
      options: [
        { label: "Warm relationship", value: "Warm relationship" },
        { label: "Cold relationship", value: "Cold relationship" },
        { label: "Do not contact", value: "Do not contact" },
        { label: "Official relationship", value: "Official relationship" },
      ]
    },
    { name: 'hubspot_link', label: 'Hubspot', type: 'string' },
    { name: 'description', label: 'Description', type: 'string' },
    { name: 'internal_thoughts', label: 'Internal Thoughts', type: 'string' },
    { name: 'foci', label: 'Foci', type: 'string' },
    { name: 'internal_champion', label: 'Internal Champion', type: 'string' },
    { name: 'shorthand_name', label: 'Org shorthand', type: 'string' },
    { name: 'ally_utility', label: 'General email', type: 'string' },
    { name: 'general_phone', label: 'General phone', type: 'string' },
    { name: 'gdrive_link', label: 'Gdrive link URL', type: 'string' },
    { name: 'overview_link', label: 'Overview URL', type: 'string' }
  ] as InputOption[];

  function handleChange(field: string, value: string): void {
    const changes = JSON.parse(`{ "${field}" : ${JSON.stringify(value)} }`)
    partnerService.update(partner.id, changes)
      .then(updated => {
        onChange(updated);
      });
  }

  function handlePicChange(files: File[]) {
    if (partner) {
      files.forEach((file: File) => {
        const location = partnerService.getNextLogoUrl(partner);
        storageService.upload(location, file)
          .then(() => {
            partnerService.update(partner.id, { logo_url: location })
              .then(updated => partnerService.getById(updated.id)
                .then(refreshed => onChange(refreshed)));
          })
      })
    }
  }

  return (partner &&
    <Stack gap={2}>
      <Card sx={{ padding: 0 }}>
        <CardHeader
          title={
            <EditField
              value={partner.name}
              display={partner.name}
              onChange={(updated: string) => handleChange('name', updated)} />
          }
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={3}>
              <Box>
                <UploadImage
                  url={partnerService.getLogoUrl(partner)}
                  onChange={handlePicChange} />
              </Box>
            </Grid>
            <Grid size={9}>
              <InputForm entity={partner} inputFields={fields} onChange={handleChange} />
            </Grid>
          </Grid>
        </CardContent>
      </Card >

      <Card >
        <CardHeader
          title='Contacts' />
        <CardContent>
          <ContactsTable entity={partner} onChange={onChange} />
        </CardContent>
      </Card>
    </Stack >
  );
};

export { PartnerDetails };

