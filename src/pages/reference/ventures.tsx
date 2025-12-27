/**
 *  reference/ventures/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {
  Divider,
  ListItemIcon,
  MenuItem
} from '@mui/material';
import { CheckOutlined } from "@ant-design/icons";

import { ListCard } from '../../components/ListCard';
import { MoreButton } from "./MoreButton";
import { EntityListPage } from '../../components/EntityListPage';
import { partnerService } from '../../services/dasPartnerService';
import { Venture, VentureService } from '../../services/dasVentureService';
import { ReferenceVentureDetails } from "../venture/ReferenceVentureDetails";

const ReferenceVenturesPage = () => {
  const ventureService = VentureService.instance();
  const { id } = useParams<string>();
  const [entities, setEntities] = useState<Venture[]>([]);
  const [filter, setFilter] = useState<string>('Active');

  useEffect(() => {
    // externally requested record, only getAll guarantees finding the record
    if (id) {
      setFilter('all');
    }
  }, []);

  useEffect(() => {
    fetchData()
  }, [filter]);

  async function fetchData() {
    const found = await filteredData();
    setEntities(found);
  }

  async function filteredData(): Promise<Venture[]> {
    if (VentureService.STATUSES.includes(filter)) {
      return await ventureService
        .findByStatus(filter)
        .then(data => data.sort((a, b) => (a.venture_code.localeCompare(b.venture_code))))
    }
    return await ventureService
      .getAll()
      .then(data => data.sort((a, b) => (a.venture_code.localeCompare(b.venture_code))))
  }

  function handleFilterChange(newFilter: string) {
    setFilter(newFilter);
  };

  function filterMenu() {
    return <>
      <MenuItem onClick={() => handleFilterChange('all')}>
        <ListItemIcon>
          {filter === 'all' && <CheckOutlined />}
        </ListItemIcon>
        Show All
      </MenuItem>
      <Divider />
      {VentureService.STATUSES.map(status => {
        return <MenuItem
          key={status}
          onClick={() => handleFilterChange(`${status}`)}>
          <ListItemIcon>
            {filter === status && <CheckOutlined />}
          </ListItemIcon>
          {status}
        </MenuItem>
      })}
    </>
  }

  return (
    <EntityListPage
      title={'Ventures'}
      entities={entities}
      pageAction={<MoreButton menuItems={filterMenu()} />}
      listItemRenderer={entity =>
        <ListCard
          key={entity.id}
          title={entity.venture_code}
          avatarImageSrc={partnerService.getLogoUrl(entity.partner!)} />}
      detailRenderer={entity => <ReferenceVentureDetails entity={entity} />} />
  );
};

export default ReferenceVenturesPage;
