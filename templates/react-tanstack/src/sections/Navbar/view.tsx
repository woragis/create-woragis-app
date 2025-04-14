import { useNavbarModel } from './model'

export const NavbarView = ({}: ReturnType<typeof useNavbarModel>) => {
  return (
    <nav>
      <center>
        <h1>Navbar</h1>
      </center>
    </nav>
  )
}
