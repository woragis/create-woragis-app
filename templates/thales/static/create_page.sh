#!/bin/sh

# Verifica se o nome da pasta foi passado como argumento
if [ -z "$1" ]; then
  echo "Por favor, forneça o nome da pasta."
  exit 1
fi

# Nome da pasta a ser criada
NOME_DA_PASTA=$1

# Cria a pasta
mkdir -p $NOME_DA_PASTA

# Caminho completo dos arquivos a serem criados
INDEX_PATH="$NOME_DA_PASTA/index.tsx"
MODEL_PATH="$NOME_DA_PASTA/model.tsx"
VIEW_PATH="$NOME_DA_PASTA/view.tsx"
STYLE_PATH="$NOME_DA_PASTA/style.ts"

# Cria e escreve no arquivo index.tsx
cat <<EOL > $INDEX_PATH
import { use${NOME_DA_PASTA^} } from './model'
import { ${NOME_DA_PASTA^}View } from './view'

export const ${NOME_DA_PASTA^} = () => {
  const model = use${NOME_DA_PASTA^}()

  return <${NOME_DA_PASTA^}View {...model} />
}
EOL

# Cria e escreve no arquivo model.tsx
cat <<EOL > $MODEL_PATH
export const use${NOME_DA_PASTA^} = () => {
  return {}
}
EOL

# Cria e escreve no arquivo view.tsx
cat <<EOL > $VIEW_PATH
import * as Styled from './style'
import { use${NOME_DA_PASTA^} } from './model'

export const ${NOME_DA_PASTA^}View = (props: ReturnType<typeof use${NOME_DA_PASTA^}>) => {
  return (
    <Styled.Container>
      <h1>${NOME_DA_PASTA^}</h1>
    </Styled.Container>
  )
}
EOL

# Cria e escreve no arquivo style.ts
cat <<EOL > $STYLE_PATH
import styled from '@emotion/styled'

export const Container = styled.div\`
  display: flex;
\`
EOL

echo "Arquivos criados com sucesso na pasta $NOME_DA_PASTA"
