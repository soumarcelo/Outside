'use client'

import { ChangeEvent, useRef, useState } from "react";
import SearchBar from "../searchbar";
import { Button, ListGroup, Overlay } from "react-bootstrap";
import { useRouter } from "next/navigation";

const suggestions = [
  "Festa junina",
  "Festa eletrônica",
  "Palestra motivacional",
  "Feira cultural",
];

export default function NavBar(props) {
  const router = useRouter();
  const [searchText, setSearchText] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const target = useRef<HTMLElement>(null);

  const searchInputEventsHandlers = {
    onInputFocusIn: () => setShowSuggestions(true),
    onInputFocusOut: () => setShowSuggestions(false),
    onInputChange: (ev: ChangeEvent<HTMLInputElement>) => {
      const text: string = ev.target.value;
      setSearchText(text);
    },
    onInputSubmit: () => router.push("/search/" + searchText)
  };

  return (
    <div>
      <nav className="navbar rounded-2 bg-body-tertiary shadow px-2" ref={target}>
        <div className="hstack gap-3 w-100">
          <a className="navbar-brand" href="#">Outside</a>
          <div className="d-none d-sm-block col-7">
            <SearchBar eventsHandlers={searchInputEventsHandlers} />
          </div>
          <div className="col">
            <button className="btn btn-success float-end">Sign In</button>
          </div>
        </div>
        <div className="d-sm-none mx-4 my-2 w-100">
          <SearchBar eventsHandlers={searchInputEventsHandlers} />
        </div>
      </nav>
      <Overlay target={target.current} show={showSuggestions} placement="top">
        {({
          placement: _placement,
          arrowProps: _arrowProps,
          show: _show,
          popper: _popper,
          hasDoneInitialMeasure: _hasDoneInitialMeasure,
          ...overlayProps
        }) => (
          <div {...overlayProps}>
            <ListGroup className="shadow-sm" style={{ width: 300 }}>
              {suggestions.map((s, index) => (
                <ListGroup.Item key={index}>
                  <Button variant="link" className="w-100 link-underline link-underline-opacity-0" onClick={() => router.push("/search/" + s)}>{s}</Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}
      </Overlay>
    </div>
  );
}