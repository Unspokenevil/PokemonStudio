import React from 'react';
import { useTranslation } from 'react-i18next';
import { DataBlockWithTitle, DataFieldsetField, DataGrid } from '../../dataBlocks';
import { MoveDataProps } from '../MoveDataPropsInterface';

const textCriticalRate = [
  'database_moves:no_critical_hit',
  'database_moves:normal',
  'database_moves:high',
  'database_moves:very_high',
  'database_moves:guaranteed',
];

export const DataDataBlock = ({ move, onClick }: MoveDataProps) => {
  const { t } = useTranslation(['database_moves']);

  const getTextCriticalRate = () => {
    if (move.movecriticalRate > 3) return t(`${textCriticalRate[4]}` as never);
    return t(`${textCriticalRate[move.movecriticalRate]}` as never);
  };

  const getPriority = () => {
    if (move.priority > 0) return `+${move.priority}`;
    return move.priority;
  };

  return (
    <DataBlockWithTitle size="half" title={t('database_moves:data')} onClick={onClick}>
      <DataGrid columns="140px 1fr" rows="1fr 1fr 1fr">
        <DataFieldsetField label={t('database_moves:power')} data={move.power} />
        <DataFieldsetField label={t('database_moves:accuracy')} data={move.accuracy} />
        <DataFieldsetField label={t('database_moves:pp')} data={move.pp} />
        <DataFieldsetField label={t('database_moves:critical_rate')} data={getTextCriticalRate()} />
        <DataFieldsetField label={t('database_moves:priority')} data={getPriority()} />
      </DataGrid>
    </DataBlockWithTitle>
  );
};