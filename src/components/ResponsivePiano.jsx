import React, { useState } from 'react';
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';
import SoundfontProvider from './SoundfontProvider';
import './styles.css';
import { getSoundfontNames } from 'smplr';
import { useSize }from '../hooks/useSize';

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

// function BasicPiano() {
//     return (
//       <SoundfontProvider
//         instrumentName="acoustic_grand_piano"
//         audioContext={audioContext}
//         // hostname={soundfontHostname}
//         render={({ isLoading, playNote, stopNote }) => (
//           <Piano
//             noteRange={noteRange}
//             width={300}
//             playNote={playNote}
//             stopNote={stopNote}
//             disabled={isLoading}
//             keyboardShortcuts={keyboardShortcuts}
//           />
//         )}
//       />
//     );
//   }
  
  export default function ResponsivePiano(props) {
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