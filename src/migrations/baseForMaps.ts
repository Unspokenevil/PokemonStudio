import { IpcMainEvent } from 'electron';
import fs from 'fs';
import path from 'path';
import { stringify } from 'csv-stringify/sync';
import { StudioMapInfo } from '@modelEntities/mapInfo';

export const saveCSV = (projectPath: string, fileId: number, languages: string[], noData?: true) => {
  const csvPath = path.join(projectPath, 'Data/Text/Studio', `${fileId}.csv`);
  const data = noData ? [languages] : [languages, ['---', '---', '---', '---']];
  if (!fs.existsSync(csvPath)) {
    fs.writeFileSync(csvPath, stringify(data));
  }
};

export const baseForMaps = async (_: IpcMainEvent, projectPath: string) => {
  const languages = ['en', 'fr', 'it', 'es'];
  saveCSV(projectPath, 200002, languages);
  saveCSV(projectPath, 200003, languages);
  saveCSV(projectPath, 200004, languages, true);
  if (!fs.existsSync(path.join(projectPath, 'Data/Tiled'))) {
    fs.mkdirSync(path.join(projectPath, 'Data/Tiled'));
  }
  if (fs.existsSync(path.join(projectPath, 'Data/Studio/rmxp_maps.json'))) {
    fs.unlinkSync(path.join(projectPath, 'Data/Studio/rmxp_maps.json'));
  }
  if (!fs.existsSync(path.join(projectPath, 'Data/Studio/map_info.json'))) {
    const defaultMapInfo: StudioMapInfo = {
      ['0']: {
        id: 0,
        children: [],
        hasChildren: false,
        isExpanded: true,
        data: {
          klass: 'MapInfoRoot',
        },
      },
    };
    fs.writeFileSync(path.join(projectPath, 'Data/Studio/map_info.json'), JSON.stringify(defaultMapInfo, null, 2));
  }
};
