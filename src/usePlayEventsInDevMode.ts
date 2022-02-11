import { HTTPStatus } from "@duelsik/twitch-overlay-toolkit/lib/BeatSaber/HTTPStatusProtocol";
import React from "react";

function createUsePlayEventsInDevMode(isDev: boolean) {
  if (!isDev) return function () {};
  return function usePlayEventsInDevMode(
    noteFullyCut: HTTPStatus.NoteFullyCutHandler
  ) {
    React.useEffect(() => {
      noteFullyCut({
        noteCut: {
          finalScore: 115,
        },
      } as HTTPStatus.NoteFullyCutMessage);

      setTimeout(() => {
        noteFullyCut({
          noteCut: {
            finalScore: 115,
          },
        } as HTTPStatus.NoteFullyCutMessage);
      }, 4000);
    }, []);

    React.useEffect(() => {
      const interval1151 = setInterval(() => {
        noteFullyCut({
          noteCut: {
            finalScore: 115,
          },
        } as HTTPStatus.NoteFullyCutMessage);
      }, 10000);

      const interval1152 = setInterval(() => {
        noteFullyCut({
          noteCut: {
            finalScore: 115,
          },
        } as HTTPStatus.NoteFullyCutMessage);
      }, 14000);

      const interval2 = setInterval(() => {
        noteFullyCut({
          noteCut: {
            finalScore: 100,
          },
        } as HTTPStatus.NoteFullyCutMessage);
      }, 300);
      return () => {
        clearInterval(interval1151);
        clearInterval(interval1152);
        clearInterval(interval2);
      };
    }, [noteFullyCut]);
  };
}

export { createUsePlayEventsInDevMode };
