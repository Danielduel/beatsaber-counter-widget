import React from 'react';
// use very scoped file to reduce size of bundle
import { useHTTPStatusWebsocket } from "@duelsik/rehooked/lib/BeatSaber/useHTTPStatusWebsocket";
import { useNumberReducer } from "@duelsik/rehooked/lib/common/useNumberReducer";
import styled from "styled-components";

type BeatSaberCounterWidgetProps = {
  notesCutText: (notesCut: number) => string
};

declare global {
  interface Window {
    BeatSaberCounterWidget: BeatSaberCounterWidgetProps;
  }
}

const httpStatusAddress = "ws://localhost:6557/socket";

type Unpacked<T> = T extends (infer U)[] ? U : T;
type Handlers = Unpacked<Parameters<typeof useHTTPStatusWebsocket>[1]>;
type NoteFullyCutHandler = NonNullable<Handlers["noteFullyCut"]>;

const NotesCutContainer = styled.div``;
const NotesCutText = styled.div``;

function Counter({ BeatSaberCounterWidget }: { BeatSaberCounterWidget: BeatSaberCounterWidgetProps }) {
  const {
    state: notesCut,
    add
  } = useNumberReducer(0);

  const noteFullyCut = React.useCallback<NoteFullyCutHandler>(() => {
    add(1);
  }, [add]);

  useHTTPStatusWebsocket({
    address: httpStatusAddress,
    debug: false,
    errorHandler: console.error
  }, [
    {
      noteFullyCut
    }
  ]);

  return (
    <NotesCutContainer className="counter__container">
      <NotesCutText className="counter__text">
        {BeatSaberCounterWidget.notesCutText(notesCut)}
      </NotesCutText>
    </NotesCutContainer>
  );
}

function App() {
  const [configLoaded, setConfigLoaded] = React.useState(false);

  React.useLayoutEffect(() => {
    setConfigLoaded(!!window.BeatSaberCounterWidget)
  }, [window.BeatSaberCounterWidget, setConfigLoaded]);

  if (configLoaded) {
    return <Counter BeatSaberCounterWidget={window.BeatSaberCounterWidget} />
  }

  return <code>Widget is not configured sadge</code>;
}

export default App;
