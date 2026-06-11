/**
 * 
 * ReportingPanel.tsx
 * 
 */
import { useEffect, useState } from 'react';
import { EntityProps } from '../../components/utils';
import VentureReportDisplay from '../../components/VentureReportDisplay';
import { Venture } from "../../data/types";
import { VentureReport, VentureReportService } from '../../services/dasVentureReportService';

export const ReportingPanel: React.FC<EntityProps<Venture>> = ({ entity }) => {
  const ventureReportService = VentureReportService.getInstance();

  const [reports, setReports] = useState<VentureReport[]>([]);

  useEffect(() => {
    if (entity) {
      ventureReportService.findByVentureName(entity.venture_code)
        .then(data => {
          console.log(data)
          setReports(data)
        })
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
