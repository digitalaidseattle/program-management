/**
 *  reference/teams/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { HomeOutlined } from "@ant-design/icons";
import {
  Breadcrumbs,
  IconButton,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { NavLink } from "react-router";

import { EntityListPage } from '../../components/EntityListPage';
import { ListCard } from '../../components/ListCard';
import { Team } from '../../data/types';
import { TeamService } from '../../services/dasTeamService';
import { TeamDetails } from "../team/TeamDetails";

const ReferenceTeamsPage = () => {
  const teamService = TeamService.getInstance();

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
    console.log(teams)
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
        detailRenderer={entity => <TeamDetails entity={entity} onChange={() => alert('nrfpt')} />}
      />
    </>
  );
};

export default ReferenceTeamsPage;
