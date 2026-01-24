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
import { profileService } from '../../services/dasProfileService';
import { Staffing, staffingService } from '../../services/dasStaffingService';
import { VentureReport, VentureReportService } from '../../services/dasVentureReportService';
import { Venture } from '../../services/dasVentureService';
import { STATUS_COMP } from '../ventures/Utils';
import { VentureReportDetails } from "../../components/VentureReportDetails";

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

const VentureReportDetailsCard = ({ venture }: { venture: Venture }) => {
  const ventureReportService = VentureReportService.instance();
  const [report, setReport] = useState<VentureReport>();
  useEffect(() => {
    if (venture) {
      ventureReportService.findLatestByVentureId(venture.id)
        .then(data => {
          setReport(data)
        })
        .catch(err => {
          console.error('Failed to load venture reports', err);
          setReport(undefined);
        });
    } else {
      setReport(undefined);
    }
  }, [venture]);

  return (
    <Card>
      <CardHeader title="Latest Status Report" />
      <CardContent>
        {report && <VentureReportDetails report={report} />}
        {!report && <Typography>No status report found.</Typography>}
      </CardContent>
    </Card>
  )
}

const ReferenceVentureDetails = ({ entity }: { entity: Venture }) => {
  return (entity &&
    <Card>
      <CardHeader
        title={entity.venture_code}
        action={STATUS_COMP[entity.status]} />
      <CardContent>
        <Grid container spacing={2}>

          <Grid size={12}>
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
          <Grid size={4}>
            <Card>
              <CardHeader title="Problem" />
              <CardContent>
                <Markdown>{entity.problem}</Markdown>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={4}>
            <Card>
              <CardHeader title="Solution" />
              <CardContent>
                <Markdown>{entity.solution}</Markdown>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={4}>
            <Card>
              <CardHeader title="Impact" />
              <CardContent>
                <Markdown>{entity.impact}</Markdown>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={12}>
            <StaffingPanel entity={entity} onChange={() => { }} />
          </Grid>
          <Grid size={12}>
            <VentureReportDetailsCard venture={entity} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )

}


export { ReferenceVentureDetails };
