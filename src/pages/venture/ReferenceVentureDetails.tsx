/**
 * 
 * ReferenceVentureDetails.tsx
 * 
 */
import { CheckOutlined, MoreOutlined } from "@ant-design/icons";
import {
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
  useTheme
} from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import { FieldRow } from '../../components/FieldRow';
import { EntityProps } from '../../components/utils';
import VentureReportDisplay from '../../components/VentureReportDisplay';
import { profileService } from '../../services/dasProfileService';
import { Staffing, staffingService } from '../../services/dasStaffingService';
import { VentureReport, ventureReportService } from '../../services/dasVentureReportService';
import { Venture } from '../../services/dasVentureService';
import { STATUS_COMP } from '../ventures/Utils';

const StaffingPanel: React.FC<EntityProps<Venture>> = ({ entity }) => {
  const [staffing, setStaffing] = useState<Staffing[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [cards, setCards] = useState<ReactNode[]>([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const showMenu = Boolean(anchorEl);


  useEffect(() => {
    if (entity) {
      staffingService.findByVentureId(entity.id)
        .then((staffing) => setStaffing(staffing));
    }
  }, [entity]);

  useEffect(() => {
    switch (filter) {
      case 'all':
        setCards(staffing.map(s => createCard(s)));
        break;
      case 'active':
        setCards(staffing.filter(s => s.status === 'Filled').map(s => createCard(s)));
        break;
      case 'open':
        setCards(staffing.filter(s => s.status === 'Please fill').map(s => createCard(s)));
        break;
      default:
        setCards(staffing.map(s => createCard(s)));
        break;
    }
  }, [filter, staffing]);

  function createCard(staffing: Staffing) {
    return <Card key={staffing.id}
      sx={{
        boxShadow: 'none',
        minWidth: { xs: '100%', sm: '17rem' }
      }}>
      <CardActionArea onClick={() => handleOpen(staffing.volunteer_id)}>
        <CardHeader
          title={staffing.volunteer ? staffing.volunteer.profile!.name : ''}
          subheader={staffing.role?.name}
          avatar={<Avatar
            variant='rounded'
            src={staffing.volunteer ? profileService.getPicUrl(staffing.volunteer.profile!) : undefined}
          />}
        />
        <CardContent>{staffing.status}</CardContent>
      </CardActionArea>
    </Card>
  }

  function handleOpen(volunteer_id: string): void {
    if (volunteer_id) {
      navigate(`/volunteers/${volunteer_id}`);
    }
  }

  function handleMoreClick(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  };

  function handleMoreClose() {
    setAnchorEl(null);
  };

  function handleFilter(filter: string) {
    setFilter(filter);
    setAnchorEl(null);
  }

  return <Card>
    <CardHeader title="Staffing"
      action={<IconButton color="primary" aria-label={`more`}
        onClick={(evt) => handleMoreClick(evt)}>
        <MoreOutlined />
      </IconButton>} >
    </CardHeader>

    <CardContent sx={{ bgcolor: theme.palette.background.default }}>
      <Grid container spacing={2}>
        {cards.map((card, idx) =>
          <Grid size={4} key={idx}>
            {card}
          </Grid>
        )}
      </Grid>
    </CardContent>
    <Menu
      id="positioned-menu"
      aria-labelledby="positioned-button"
      anchorEl={anchorEl}
      open={showMenu}
      onClose={handleMoreClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <MenuItem onClick={() => handleFilter('all')}>
        <ListItemIcon>
          {filter === 'all' && <CheckOutlined />}
        </ListItemIcon>
        Show All
      </MenuItem>
      <MenuItem onClick={() => handleFilter('active')}>
        <ListItemIcon>
          {filter === 'active' && <CheckOutlined />}
        </ListItemIcon>
        Show Active
      </MenuItem>
      <MenuItem onClick={() => handleFilter('open')}>
        <ListItemIcon>
          {filter === 'open' && <CheckOutlined />}
        </ListItemIcon>
        Show Open
      </MenuItem>
    </Menu>
  </Card>
}

const ReportPanel: React.FC<EntityProps<Venture>> = ({ entity }) => {
  const [reports, setReports] = useState<VentureReport[]>([]);

  useEffect(() => {
    if (entity) {
      ventureReportService.findByVentureId(entity.id)
        .then(data => setReports(data))
        .catch(err => {
          console.error('Failed to load venture reports', err);
          setReports([]);
        });
    } else {
      setReports([]);
    }
  }, [entity]);

  return <VentureReportDisplay reports={reports} />;
}

const ReferenceVentureDetails = ({ entity }: { entity: Venture }) => {

  return (entity &&
    <Card>
      <CardHeader
        title={entity.venture_code}
        action={STATUS_COMP[entity.status]} />
      <CardContent>
        <Grid container spacing={2}>

          <Grid size={6}>
            <FieldRow label="Partner">
              <Typography>{entity.partner?.name}</Typography>
            </FieldRow>
            <FieldRow label="Painpoint">
              <Typography>{entity.painpoint}</Typography>
            </FieldRow>
            <FieldRow label="Program Areas">
              <Typography>{entity.program_areas.join(', ')}</Typography>
            </FieldRow>
          </Grid>
          <Grid size={6}>
            <FieldRow label="Problem">
              <Markdown>{entity.problem}</Markdown>
            </FieldRow>
            <FieldRow label="Solution">
              <Markdown>{entity.solution}</Markdown>
            </FieldRow>
            <FieldRow label="Impact">
              <Markdown>{entity.impact}</Markdown>
            </FieldRow>
          </Grid>
          <Grid size={12}>
            <StaffingPanel entity={entity} onChange={() => { }} />
          </Grid>
          <ReportPanel entity={entity} onChange={() => { }} />
        </Grid>
      </CardContent>
    </Card>
  )

}


export { ReferenceVentureDetails };
