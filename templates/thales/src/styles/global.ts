import { css } from '@emotion/react'

export const styles = css`
  :root {
    --background: #fcfcfc;
    --black: #000;
    --white: #ffffff;
    --green: #75fabc;
    --grey-dark: #7a7a7a;
    --grey-extra-dark: #545454;
    --grey-light-border: #dedede;
    --grey-light: #f3f3f3;
    --red: #c63c3c;
    --yellow: #e8cf3d;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
  }

  body {
    --webkit-font-smoothing: antialiased;
  }

  button {
    cursor: pointer;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #999;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-track {
    background-color: #f0f0f0;
  }
`
