import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

import { Container, Cell } from '../Grid';
import Icon from '../Icon';
import device from '../../styles/device';

const Overlay = styled.div`
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
  padding: 0;
`;

const ModalContainer = styled.div`
  position: relative;
  overflow: auto;
  background: white;
  border-radius: 3px;
  height: 100%;
  width: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  @media all and ${device.tablet} {
    transform: translate(-50%, -50%);
    height: auto;
    width: auto;
    max-width: 500px;
    max-height: 600px;
  }
`;

const ModalContent = styled(Cell)`
  background-color: white;
  font-family: 'Baloo Paaji 2', 'sans-serif';
  padding: 20px 10px;
`;

const ModalTitle = styled.span`
  display: inline-block;
  vertical-align: middle;
  text-transform: uppercase;
  font-family: 'Baloo Paaji 2', 'sans-serif';
`;

const CloseButton = styled.button`
  background-color: transparent;
  padding: 0;
  border: 0;
  vertical-align: middle;
`;

const ModalIcon = styled(Icon)`
  margin-right: 10px;
  color: #ffc0cb;
`;

const CloseIcon = styled(Icon)`
  color: #717171;
`;

interface Props {
  onClose: Function;
  children?: React.ReactNode;
  title?: string;
  icon?: string;
}

const Modal = ({ onClose, children = null, title = '', icon = '' }: Props) => {
  const node = useRef(null);

  const onCloseHandler = (evt: React.MouseEvent | KeyboardEvent): void => {
    evt.stopPropagation();

    onClose(evt);
  };

  const handleOverlayClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    if (e.target === node.current) {
      onCloseHandler(e);
    }
  };

  const escKeyDownHandler = (event: KeyboardEvent): void => {
    event.stopPropagation();

    if (event.keyCode === 27 || event.key.toLowerCase() === 'escape') {
      onCloseHandler(event);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', escKeyDownHandler);

    return (): void => {
      document.removeEventListener('keydown', escKeyDownHandler);
    };
  }, []);

  return (
    <Overlay ref={node} onClick={handleOverlayClick}>
      <ModalContainer>
        <Container flexDirection="column">
          <Cell padding="20px 10px">
            <Container justifyContent="space-between" alignItems="center">
              <Cell>
                {icon.length > 0 && <ModalIcon size={36}>{icon}</ModalIcon>}
                <ModalTitle>{title}</ModalTitle>
              </Cell>
              <Cell>
                <CloseButton type="button" onClick={onCloseHandler}>
                  <CloseIcon size={24}>close</CloseIcon>
                </CloseButton>
              </Cell>
            </Container>
          </Cell>
          <ModalContent>{children}</ModalContent>
        </Container>
      </ModalContainer>
    </Overlay>
  );
};

export default Modal;
