
import { redirect } from 'next/navigation'
import { PATHS } from '../utils/constants'


export default function Home() {
  redirect(PATHS.BOARD)

  return ('')
}
