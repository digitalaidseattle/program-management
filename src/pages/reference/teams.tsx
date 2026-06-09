/**
 *  reference/teams/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { CheckOutlined, HomeOutlined } from "@ant-design/icons";
import {
  Breadcrumbs,
  IconButton,
  ListItemIcon,
  MenuItem,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { NavLink, useParams } from "react-router";

import { EntityListPage } from '../../components/EntityListPage';
import { ListCard } from '../../components/ListCard';
import { Team } from '../../data/types';
import { TeamService } from '../../services/dasTeamService';
import { MoreButton } from "./MoreButton";
import { TeamDetails } from "../team";

const ReferenceTeamsPage = () => {
  const teamService = TeamService.getInstance();

  const { id } = useParams<string>();
  const [teams, setTeams] = useState<Team[]>([]);
  const [filtered, setFiltered] = useState<Team[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  useEffect(() => {
    teamService.getAll()
      .then(tt => setTeams(tt));
  }, []);


  useEffect(() => {
    filterData();
  }, [teams, searchValue]);

  async function filterData() {
    const found = teams
      .filter(t => {
        return (searchValue === "" || t.name.toLowerCase().includes(searchValue))
      })
      .sort((a, b) => (a.name.localeCompare(b.name)));
    setFiltered(found);
  }


  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <NavLink to="/" ><IconButton size="medium"><HomeOutlined /></IconButton></NavLink>
        <Typography color="text.primary">Teams</Typography>
      </Breadcrumbs>
      <EntityListPage
        title={'Teams'}
        entities={filtered}
        filterBy={searchValue}
        onFilter={setSearchValue}
        listItemRenderer={entity => <ListCard
          key={entity.id}
          title={entity.name} />}
        // detailRenderer={entity => <Typography>{entity.name}</Typography>}
        detailRenderer={entity => <TeamDetails entity={entity} onChange={() => alert('nrfpt')} />}
      />
    </>
  );
};

export default ReferenceTeamsPage;
