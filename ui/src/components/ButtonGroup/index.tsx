import React from 'react';
import styled from 'styled-components';

import Button from '../Button';

interface ItemProps {
  active?: boolean;
}

const Item = styled.li<ItemProps>((props) => ({
  backgroundColor: props.active ? '#e6e8ec' : '#fff',
  marginBottom: '10px',
  borderRadius: '3px'
}));

export const ButtonGroup: React.FunctionComponent = () => {
  return (
    <ul>
      <Item>
        <Button type="wide">
          <i className="material-icons">format_list_bulleted</i>
        </Button>
      </Item>
      <Item>
        <Button type="wide">Downloading</Button>
      </Item>
      <Item>
        <Button type="wide">Completed</Button>
      </Item>
      <Item>
        <Button type="wide">Active</Button>
      </Item>
      <Item>
        <Button type="wide">Inactive</Button>
      </Item>
    </ul>
  );
};

const StyledButtonGroup = styled(ButtonGroup)``;

export default StyledButtonGroup;
