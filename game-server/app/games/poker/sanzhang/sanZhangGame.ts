import { Constructor } from "../../../util/helpers";
import Game from "../../game";


export default function SanZhangGame<T extends Constructor<Game>>(Base: T) {
  return class extends Base  {
    
  }
}