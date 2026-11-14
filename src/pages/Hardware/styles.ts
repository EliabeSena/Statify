import styled from "styled-components";

export const PageContainer = styled.div`
  .infoCardContainer {
    display: flex;
    align-items: center;
    gap: 1rem;
    @media (max-width: 1100px) {
      flex-direction: column;
    }
  }

  .simpleInfoContainer {
    p { color: var(--accentColor)}
  }

  .energyContainer {
    display: flex;
    flex-direction: column;
  }

  .buttonContainer {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .permissionButton {
    &:hover {
      transform: scale(1.05);
    }
    transition: 0.2s;
    cursor: pointer;
    width: 200px;
    height: 36px;
    background-color: CanvasText;
    border-radius: 12px;
    color: Canvas;
    font-weight: 400;
    border: 0;
  }
`

export const DisplayContainer = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;

  h1 {
    padding-left: 2rem;
    padding-right: 4rem;
  }

  .screenData {
    display: flex;
    gap: 2rem;
    flex: 1;
    flex-direction: column;
  }

  h5 {
    font-weight: 400;
    color: var(--accentColor);
    font-size: 16px;
  }

  p {
    font-size: 24px;
  }
`
export const MediaContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  row-gap: 1rem;

  h1 {
    font-size: 16px;
    color: var(--accentColor);
    font-weight: 400;
    text-transform: uppercase;
  }
`