import React from 'react';
import styled from 'styled-components';
import Button from '../Button';

// interface Props {
//   onAdd?: Function;
//   onStop?: Function;
//   onStart?: Function;
//   onDelete?: Function;
//   onConfig?: Function;
// }

interface NavItemProps {
  position?: string;
}

const Nav = styled.ul`
  overflow: auto;
  width: 100%;
`;

const NavItem = styled('li')<NavItemProps>`
  float: ${(props) => props.position};
  margin: 0 5px;
`;

const Actions: React.FC = () => {
  return (
    <Nav>
      <NavItem position="right">
        <Button>
          <i className="material-icons">settings</i>
        </Button>
      </NavItem>
      <NavItem position="right">
        <Button>
          <i className="material-icons">delete</i>
        </Button>
      </NavItem>
      <NavItem position="right">
        <Button>
          <i className="material-icons">stop</i>
        </Button>
      </NavItem>
      <NavItem position="right">
        <Button>
          <i className="material-icons">play_arrow</i>
        </Button>
      </NavItem>

      <NavItem position="left">
        <Button>
          <i className="material-icons">add</i>
        </Button>
      </NavItem>
    </Nav>
  );
};

export default Actions;
