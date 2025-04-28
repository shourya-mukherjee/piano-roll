import React, { useEffect, useRef } from 'react';
// @ts-ignore
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';

// The Tone variable is now available globally from the CDN
declare global {
  interface Window {
    Tone: any;
  }
}

const App: React.FC = () => {
  const synthRef = useRef<any>(null);
  const firstNote = MidiNumbers.fromNote('c3');
  const lastNote = MidiNumbers.fromNote('c4');
  const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote: firstNote,
    lastNote: lastNote,
    keyboardConfig: KeyboardShortcuts.HOME_ROW,
  });

  // Create a synth on component mount
  useEffect(() => {
    synthRef.current = new window.Tone.Synth().toDestination();
    // Ensure audio context is started on user interaction
    const startAudio = () => {
      window.Tone.start();
    };
    window.addEventListener('click', startAudio);
    return () => {
      window.removeEventListener('click', startAudio);
    };
  }, []);

  // Function to handle note press
  const handleNotePress = (midiNumber: number) => {
    if (synthRef.current) {
      const note = window.Tone.Frequency(midiNumber, 'midi').toNote();
      synthRef.current.triggerAttackRelease(note, '8n');
    }
  };

  return (
    <div style={{ width: '100vw',
        minHeight: '100vh',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'red',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box'}}>
      <h1>Virtual Piano</h1>
      <div style={{ display: 'flex', alignItems: 'center',justifyContent: 'center' }}>
        <Piano
            noteRange={{ first: firstNote, last: lastNote }}
            playNote={handleNotePress}
            stopNote={() => {}}
            width={1000}
            keyWidthToHeight={0.2}
            keyboardShortcuts={keyboardShortcuts}
        />
      </div>
    </div>
  );
};

export default App; 