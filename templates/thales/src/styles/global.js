import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  :root {
      --background: #FCFCFC;
      --black: #000;
      --white: #FFFFFF;
      --green: #75FABC;
      --grey-dark: #7A7A7A;
      --grey-extra-dark: #545454;
      --grey-light-border: #DEDEDE;
      --grey-light: #F3F3F3;
      --red: #C63C3C;
      --yellow: #E8CF3D;
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
