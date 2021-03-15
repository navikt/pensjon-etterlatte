import React from "react";
import { Route, Switch } from "react-router";
import "./App.less";
import NotFound from "./NotFound";
import SoknadDialog from "./components/soknad/SoknadDialog";
import Labs from "./components/Labs";
import ContextProviders from "./context/ContextProviders";
// import { autentiseringsInterceptor } from "./autentisering/autentisering";
// import axios from "axios";

const App = () => {
    // const [autentisert, settAutentisering] = useState<boolean>(false);

    // autentiseringsInterceptor()

    // useEffect(() => {
    //     verifiserAtBrukerErAutentisert(settAutentisering);
    // }, [autentisert]);

    return (
        <ContextProviders>
            <Switch>
                <Route path={"/labs"}>
                    <Labs />
                </Route>
                <Route path={"/soknad"}>
                    <SoknadDialog />
                </Route>
                <Route>
                    <NotFound />
                </Route>
            </Switch>
        </ContextProviders>
    );
};

export default App;
