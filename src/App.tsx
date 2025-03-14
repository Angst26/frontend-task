import "./App.css";
import Loading from "./components/loading";
import ViewerComponent from "./components/viewer-component";

import {Widget} from "./components/widget.tsx";

function App() {

    return (
        <>
            <ViewerComponent>
                <Loading />
                <Widget/>
            </ViewerComponent>
        </>
    );
}

export default App;


