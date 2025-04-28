import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import useResizeObserver from '@react-hook/resize-observer';
import 'react-piano/dist/styles.css';

import SoundfontProvider from './SoundfontProvider';
import './styles.css';

const audioContext = new window.AudioContext();
// const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net';

const noteRange = {
  first: MidiNumbers.fromNote('c3'),
  last: MidiNumbers.fromNote('f4'),
};
const keyboardShortcuts = KeyboardShortcuts.create({
  firstNote: noteRange.first,
  lastNote: noteRange.last,
  keyboardConfig: KeyboardShortcuts.HOME_ROW,
});

const useSize = (target) => {
  const [size, setSize] = React.useState({ width: 1 });

  React.useLayoutEffect(() => {
    setSize(target.current.getBoundingClientRect());
  }, [target]);

  useResizeObserver(target, (entry) => setSize(entry.contentRect));
  return size;
};

function App() {
  return (
    <div>
      {/* <h1>react-piano demos</h1> */}
      {/* <div className="mt-5">
        <p>Basic piano with hardcoded width</p>
        <BasicPiano />
      </div> */}

      <div className="mt-5">
        {/* <p>
          Responsive piano which resizes to container's width. Try resizing the
          window!
        </p> */}
        <ResponsivePiano />
      </div>

      {/* <div className="mt-5">
        <p>Piano with custom styling - see styles.css</p>
        <ResponsivePiano className="PianoDarkTheme" />
      </div> */}
    </div>
  );
}

function BasicPiano() {
  return (
    <SoundfontProvider
      instrumentName="acoustic_grand_piano"
      audioContext={audioContext}
      // hostname={soundfontHostname}
      render={({ isLoading, playNote, stopNote }) => (
        <Piano
          noteRange={noteRange}
          width={300}
          playNote={playNote}
          stopNote={stopNote}
          disabled={isLoading}
          keyboardShortcuts={keyboardShortcuts}
        />
      )}
    />
  );
}

function ResponsivePiano(props) {
  const target = React.useRef(null);
  const size = useSize(target);

  return (
    <div ref={target}>
      <SoundfontProvider
        instrumentName="acoustic_grand_piano"
        audioContext={audioContext}
        // hostname={soundfontHostname}
        render={({ isLoading, playNote, stopNote }) => (
          <Piano
            noteRange={noteRange}
            width={size.width}
            playNote={playNote}
            stopNote={stopNote}
            disabled={isLoading}
            keyboardShortcuts={keyboardShortcuts}
            {...props}
          />
        )}
      />
    </div>
  );
}

export default App;
