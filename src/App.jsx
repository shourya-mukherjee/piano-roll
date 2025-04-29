import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import useResizeObserver from '@react-hook/resize-observer';
import 'react-piano/dist/styles.css';

import SoundfontProvider from './components/SoundfontProvider';
import PianoRoll from './components/PianoRoll';
import './styles.css';
import { getSoundfontNames } from 'smplr';

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
  const selectRef = React.useRef(null);
  const size = useSize(target);
  const [selectedInstrument, setSelectedInstrument] = useState('acoustic_grand_piano');
  const availableInstruments = getSoundfontNames();

  const handleInstrumentChange = (e) => {
    setSelectedInstrument(e.target.value);
    // Blur (remove focus from) the select element after selection
    selectRef.current?.blur();
  };

  const dispatchNoteEvent = (type, midiNumber) => {
    window.dispatchEvent(new CustomEvent(type, { 
      detail: { midiNumber } 
    }));
  };

  return (
    <div ref={target}>
      <div style={{ marginBottom: '20px' }}>
        <select
          ref={selectRef}
          value={selectedInstrument}
          onChange={handleInstrumentChange}
          style={{
            padding: '8px',
            fontSize: '16px',
            borderRadius: '4px',
            width: '200px'
          }}
        >
          {availableInstruments.map((instrument) => (
            <option key={instrument} value={instrument}>
              {instrument.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </option>
          ))}
        </select>
      </div>
      <SoundfontProvider
        instrumentName={selectedInstrument}
        audioContext={audioContext}
        render={({ isLoading, playNote, stopNote }) => (
          <div>
            <PianoRoll
              noteRange={noteRange}
              width={size.width}
              height={1000}
              onPlayNote={playNote}
              onStopNote={stopNote}
            />
            <Piano
              keyWidthToHeight={0.6}
              noteRange={noteRange}
              width={size.width}
              playNote={(midiNumber) => {
                playNote(midiNumber);
                dispatchNoteEvent('pianoNoteOn', midiNumber);
              }}
              stopNote={(midiNumber) => {
                stopNote(midiNumber);
                dispatchNoteEvent('pianoNoteOff', midiNumber);
              }}
              disabled={isLoading}
              keyboardShortcuts={keyboardShortcuts}
              {...props}
            />
          </div>
        )}
      />
    </div>
  );
}

export default App;
