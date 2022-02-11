import React from "react";
import cn from "classnames";
import styled from "styled-components";
// use very scoped file to reduce size of bundle
import { useHTTPStatusWebsocket } from "@duelsik/twitch-overlay-toolkit/lib/BeatSaber/useHTTPStatusWebsocket";
import { useNumberReducer } from "@duelsik/twitch-overlay-toolkit/lib/common/useNumberReducer";
import { createUsePlayEventsInDevMode } from "./usePlayEventsInDevMode";
import { useDelayedTrigger } from "./useDelayedTrigger";

const usePlayEventsInDevMode = createUsePlayEventsInDevMode(window.location.search === "?dev");

type BeatSaberCounterWidgetProps = {
  notesCutText: (notesCut: number) => string;
};

type BeatSaberCounterWidgetPerfectCuts = BeatSaberCounterWidgetProps & {
  delayToHide: number;
};

declare global {
  interface Window {
    BeatSaberCounterWidget: BeatSaberCounterWidgetProps;
    BeatSaberCounterWidgetPerfectCuts: BeatSaberCounterWidgetPerfectCuts;
  }
}

const httpStatusAddress = "ws://localhost:6557/socket";

type Unpacked<T> = T extends (infer U)[] ? U : T;
type Handlers = Unpacked<Parameters<typeof useHTTPStatusWebsocket>[1]>;
type NoteFullyCutHandler = NonNullable<Handlers["noteFullyCut"]>;

const NotesCutContainer = styled.div``;
const NotesCutText = styled.div``;

const NotesPerfectCutContainer = styled.div``;
const NotesPerfectCutText = styled.div``;

type CounterProps = {
  BeatSaberCounterWidget: BeatSaberCounterWidgetProps;
  BeatSaberCounterWidgetPerfectCuts: BeatSaberCounterWidgetPerfectCuts;
};

function Counter({
  BeatSaberCounterWidget,
  BeatSaberCounterWidgetPerfectCuts,
}: CounterProps) {
  const { state: notesCut, add: notesCutAdd } = useNumberReducer(0);

  const { state: notesCut115, add: notesCut115Add } = useNumberReducer(0);
  const [shouldShow115, triggerShouldShow115] = useDelayedTrigger(
    BeatSaberCounterWidgetPerfectCuts.delayToHide - 1000
  );
  const [shouldRender115, triggerShouldRender115] = useDelayedTrigger(
    BeatSaberCounterWidgetPerfectCuts.delayToHide
  );

  const noteFullyCut = React.useCallback<NoteFullyCutHandler>(
    (noteFullyCutMessage) => {
      notesCutAdd(1);
      if (noteFullyCutMessage.noteCut.finalScore === 115) {
        notesCut115Add(1);
        triggerShouldShow115();
        triggerShouldRender115();
      }
    },
    [notesCutAdd, notesCut115Add, triggerShouldShow115, triggerShouldRender115]
  );

  useHTTPStatusWebsocket(
    {
      address: httpStatusAddress,
      debug: false,
      errorHandler: console.error,
    },
    [
      {
        noteFullyCut,
      },
    ]
  );

  usePlayEventsInDevMode(noteFullyCut);

  return (
    <>
      <NotesCutContainer className="counter__container">
        <NotesCutText className="counter__text">
          {BeatSaberCounterWidget.notesCutText(notesCut)}
        </NotesCutText>
      </NotesCutContainer>
      {shouldRender115 && (
        <NotesPerfectCutContainer className={cn(
            "counter__perfectNotes--container",
            {
              "shouldShow": shouldShow115,
              "shouldHide": !shouldShow115
            }
          )}>
          <NotesPerfectCutText className="counter__perfectNotes--text">
            {BeatSaberCounterWidgetPerfectCuts.notesCutText(notesCut115)}
          </NotesPerfectCutText>
        </NotesPerfectCutContainer>
      )}
    </>
  );
}

function App() {
  const [configLoaded, setConfigLoaded] = React.useState(false);

  React.useLayoutEffect(() => {
    setConfigLoaded(!!window.BeatSaberCounterWidget);
  }, [window.BeatSaberCounterWidget, setConfigLoaded]);

  if (configLoaded) {
    return (
      <Counter
        BeatSaberCounterWidget={window.BeatSaberCounterWidget}
        BeatSaberCounterWidgetPerfectCuts={
          window.BeatSaberCounterWidgetPerfectCuts
        }
      />
    );
  }

  return <code>Widget is not configured sadge</code>;
}

export default App;
