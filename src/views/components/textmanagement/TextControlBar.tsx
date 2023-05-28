import { DarkButton, SecondaryButtonWithPlusIcon } from '@components/buttons';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ControlBar } from '@components/ControlBar';
import { SelectText } from '@components/selects';
import { TextDialogsRef } from './editors/TextEditorOverlay';
import { StudioShortcutActions, useShortcut } from '@utils/useShortcuts';
import styled from 'styled-components';
import { useTextInfos } from '@utils/useTextInfos';

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
`;

type TextControlBarProps = {
  dialogsRef?: TextDialogsRef;
};

/**
 * Control bar responsive of handling navigation through texts & opening the texts creation dialog.
 */
export const TextControlBar = ({ dialogsRef }: TextControlBarProps) => {
  const { t } = useTranslation('text_management');
  const { selectedDataIdentifier: fileId, setSelectedDataIdentifier, getPreviousFileId, getNextFileId, state } = useTextInfos();

  // Definition of the control bar shortcuts
  const shortcutMap = useMemo<StudioShortcutActions>(() => {
    // No shortcut if an editor is opened
    const isShortcutEnabled = () => dialogsRef?.current?.currentDialog === undefined;
    return {
      db_previous: () => isShortcutEnabled() && setSelectedDataIdentifier({ textInfo: getPreviousFileId() }),
      db_next: () => isShortcutEnabled() && setSelectedDataIdentifier({ textInfo: getNextFileId() }),
      db_new: () => isShortcutEnabled() && dialogsRef?.current?.openDialog('new'),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileId]);
  useShortcut(shortcutMap);

  /** Function opening the ability creation dialog if use clicks on New (not shown if there's no dialogsRef) */
  const onClickNew = dialogsRef ? () => dialogsRef.current?.openDialog('new') : undefined;
  /* Force control bar to refresh the text */
  state.projectText;
  /** Trololo https://www.youtube.com/watch?v=oavMtUWDBTM&pp=ygUHdHJvbG9sbw%3D%3D */

  return (
    <ControlBar>
      <ButtonContainer>
        {onClickNew ? <SecondaryButtonWithPlusIcon onClick={onClickNew}>{t('new')}</SecondaryButtonWithPlusIcon> : <></>}
        <DarkButton>{t('manage_languages')}</DarkButton>
      </ButtonContainer>
      <SelectText fileId={fileId.toString()} onChange={(fileId) => setSelectedDataIdentifier({ textInfo: Number(fileId) })} />
    </ControlBar>
  );
};