import React from 'react';
import styled from 'styled-components';
import { Objective, ObjectiveCategoryType, ObjectiveType } from '@modelEntities/quest/Quest.model';
import { padStr } from '@utils/PadStr';
import { useTranslation } from 'react-i18next';
import { GoalCategory } from '@components/categories';
import { DataGoalGrid } from './QuestTableStyle';
import { ReactComponent as DragIcon } from '@assets/icons/global/drag.svg';
import { buildGoalText } from '@utils/QuestUtils';
import { useGlobalState } from '@src/GlobalStateProvider';
import { DeleteButtonOnlyIcon, EditButtonOnlyIcon } from '@components/buttons';
import { EditButtonOnlyIconContainer } from '@components/buttons/EditButtonOnlyIcon';
import theme from '@src/AppTheme';
import { DraggableProvided } from 'react-beautiful-dnd';

type RenderGoalContainerProps = {
  isDragging: boolean;
  dragOn: boolean;
};

const RenderGoalContainer = styled(DataGoalGrid).attrs<RenderGoalContainerProps>((props) => ({
  'data-dragged': props.dragOn && props.isDragging ? true : undefined,
}))<RenderGoalContainerProps>`
  box-sizing: border-box;
  height: 40px;
  padding: 0 4px 0 8px;
  margin: 0 -4px 0 -8px;
  box-shadow: ${({ isDragging }) => (isDragging ? `0 0 5px ${theme.colors.dark8}` : 'none')};

  & span:nth-child(1) {
    color: ${theme.colors.text700};
    height: 18px;

    :hover {
      cursor: grab;
    }
  }

  & .buttons:nth-child(6) {
    display: flex;
    gap: 4px;
    justify-content: end;
    align-items: center;
    visibility: hidden;
  }

  & :hover {
    .buttons:nth-child(6) {
      visibility: ${({ dragOn }) => (dragOn ? `hidden` : 'visible')};
    }
  }

  &[data-dragged] {
    background-color: ${theme.colors.dark14};
    color: ${theme.colors.text100};
    border-radius: 8px;
  }

  ${EditButtonOnlyIconContainer} {
    background-color: ${theme.colors.primarySoft};

    &:hover {
      background-color: ${theme.colors.secondaryHover};
    }

    &:active {
      background-color: ${theme.colors.primarySoft};
    }
  }

  @media ${theme.breakpoints.dataBox422} {
    grid-template-columns: 18px 25px 160px 104px auto;

    span:nth-child(4) {
      display: none;
    }
  }
`;

const categoryGoal: Record<ObjectiveType, ObjectiveCategoryType> = {
  objective_speak_to: 'interaction',
  objective_obtain_item: 'discovery',
  objective_see_pokemon: 'exploration',
  objective_beat_pokemon: 'battle',
  objective_catch_pokemon: 'battle',
  objective_beat_npc: 'battle',
  objective_obtain_egg: 'discovery',
  objective_hatch_egg: 'discovery',
};

type RenderGoalProps = {
  objective: Objective;
  index: number;
  provided: DraggableProvided;
  isDragging: boolean;
  dragOn: boolean;
  onClickEdit: () => void;
  onClickDelete: () => void;
};

export const RenderGoal = React.forwardRef<HTMLInputElement, RenderGoalProps>(
  ({ objective, index, provided, isDragging, dragOn, onClickEdit, onClickDelete }, ref) => {
    const [state] = useGlobalState();
    const { t } = useTranslation('database_quests');
    return (
      <RenderGoalContainer
        gap="16px"
        ref={ref}
        {...provided.draggableProps}
        style={{
          ...provided.draggableProps.style,
        }}
        isDragging={isDragging}
        dragOn={dragOn}
      >
        <span {...provided.dragHandleProps}>
          <DragIcon />
        </span>
        <span>#{padStr(index + 1, 2)}</span>
        <span>{t(objective.objectiveMethodName)}</span>
        <GoalCategory category={categoryGoal[objective.objectiveMethodName]}>{t(categoryGoal[objective.objectiveMethodName])}</GoalCategory>
        <span>{buildGoalText(objective, state, t)}</span>
        <div className="buttons">
          <EditButtonOnlyIcon size="s" color={theme.colors.primaryBase} onClick={onClickEdit} />
          <DeleteButtonOnlyIcon size="s" onClick={onClickDelete} />
        </div>
      </RenderGoalContainer>
    );
  }
);
RenderGoal.displayName = 'RenderGoal';