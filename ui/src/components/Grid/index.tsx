import styled from 'styled-components';

interface ContainerProps {
  height?: string;
  overflow?: string;
  width?: string;
  maxWidth?: string;
  margin?: string;
  padding?: string;
  flexDirection?: string;
  alignItems?: string;
  justifyContent?: string;
  flexWrap?: string;
}

export const Container = styled.div<ContainerProps>`
  display: flex;
  flex: 1;
  height: ${({ height = 'auto' }): string => height};
  overflow: ${({ overflow = 'inherit' }): string => overflow};
  width: ${({ width = 'auto' }): string => width};
  max-width: ${({ maxWidth = 'inherit' }): string => maxWidth};
  margin: ${({ margin = '0' }): string => margin};
  padding: ${({ padding = '0' }): string => padding};
  flex-direction: ${({ flexDirection = 'row' }): string => flexDirection};
  flex-wrap: ${({ flexWrap = 'nowrap' }): string => flexWrap};
  justify-content: ${({ justifyContent = 'flex-start' }): string =>
    justifyContent};
  align-items: ${({ alignItems = 'stretch' }): string => alignItems};
`;

interface CellProps {
  height?: string;
  minHeight?: string;
  width?: string;
  maxWidth?: string;
  margin?: string;
  padding?: string;
  flexGrow?: number;
  flexBasis?: string;
  alignSelf?: string;
  textAlign?: string;
  flexShrink?: number;
}

export const Cell = styled.div<CellProps>`
    height: ${({ height = 'auto' }): string => height}
    width: ${({ width = 'auto' }): string => width}
    max-width: ${({ maxWidth = 'inherit' }): string => maxWidth}
    min-height: ${({ minHeight = '0' }): string => minHeight}
    margin: ${({ margin = '0' }): string => margin}
    padding: ${({ padding = '0' }): string => padding}
    flex-grow: ${({ flexGrow = 0 }): number => flexGrow}
    flex-basis: ${({ flexBasis = 'auto' }): string => flexBasis}
    align-self: ${({ alignSelf = 'auto' }): string => alignSelf}
    text-align: ${({ textAlign = 'inherit' }): string => textAlign}
    flex-shrink: ${({ flexShrink = 1 }): number => flexShrink}
`;
