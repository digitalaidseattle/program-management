/**
 *  reference/ventures/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { NavLink } from 'react-router-dom';

import { CheckOutlined, HomeOutlined } from "@ant-design/icons";
import {
  Breadcrumbs,
  IconButton,
  ListItemIcon,
  MenuItem,
  Typography
} from '@mui/material';
import { EntityListPage } from '../../components/EntityListPage';
import { ListCard } from '../../components/ListCard';
import { VentureDao } from "../../data/coda/VentureDao";
import { Venture } from "../../data/types";
import { VentureService } from "../../services/dasVentureService";
import { ReferenceVentureDetails } from "../venture/referenceVentureDetails";
import { MoreButton } from "./MoreButton";

const ReferenceVenturesPage = () => {

  const { id } = useParams<string>();

  const [ventures, setVentures] = useState<Venture[]>([]);
  const [filtered, setFiltered] = useState<Venture[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>(['Active']);
  const [searchValue, setSearchValue] = useState<string>('');

  useEffect(() => {
    VentureDao.getInstance()
      .getAll()
      .then(v => setVentures(v));
  }, []);

  useEffect(() => {
    // externally requested record, only getAll guarantees finding the record
    if (id) {
      setStatusFilter(['Active', 'Ready for consideration', "Submitted by Partner"]);
    }
  }, []);

  useEffect(() => {
    filterData()
  }, [ventures, statusFilter, searchValue]);


  function filterData() {
    const found = ventures
      .filter(v => {
        return statusFilter.includes(v.status)
          && (searchValue === "" || v.venture_code.toLowerCase().includes(searchValue))
      })
      .sort((a, b) => (a.title.localeCompare(b.title)));
    setFiltered(found);
  }

  function handleStatusChange(newFilter: string) {
    const updated = statusFilter.includes(newFilter)
      ? statusFilter.filter(e => e !== newFilter)
      : [...statusFilter, newFilter];
    setStatusFilter(updated);
  };

  function filterMenu() {
    return <>
      {VentureService.STATUSES.map(status =>
        <MenuItem key={status} onClick={() => handleStatusChange(status)}>
          <ListItemIcon>
            {statusFilter.includes(status) && <CheckOutlined />}
          </ListItemIcon>
          {status}
        </MenuItem>
      )}
    </>
  }

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <NavLink to="/" ><IconButton size="medium"><HomeOutlined /></IconButton></NavLink>
        <Typography color="text.primary">Ventures</Typography>
      </Breadcrumbs>
      <EntityListPage
        title={'Ventures'}
        entities={filtered}
        filterBy={searchValue}
        onFilter={setSearchValue}
        pageAction={<MoreButton menuItems={filterMenu()} />}
        listItemRenderer={entity =>
          <ListCard
            key={entity.id}
            title={entity.venture_code}
            avatarImageSrc={entity.icon}
          />}
        detailRenderer={entity => (<ReferenceVentureDetails entity={entity} />)} />
    </>
  );
};

export default ReferenceVenturesPage;
