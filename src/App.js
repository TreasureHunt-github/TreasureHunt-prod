import { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home/Home.jsx";
import { Stafford } from "./pages/Stafford/Stafford.jsx";
import { Page404 } from "./pages/Page404/Page404.jsx";

export default class App extends Component {
  render () {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/stafford/:id" element={<Stafford/>}/>
          <Route path="/*" element={<Page404/>}/>
        </Routes>
      </Router>
    );
  }
}
