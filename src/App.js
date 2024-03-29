import BrowseRouter from "./BrowseRouter";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faInstagram,
  faFacebookF,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";

library.add(faInstagram, faFacebookF, faLinkedinIn);

function App() {
  return (
    <div>
      <BrowseRouter></BrowseRouter>
    </div>
  );
}

export default App;
