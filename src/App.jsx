import 'react-piano/dist/styles.css';
import { ResponsivePiano } from './components';
import { KeyboardShortcuts, MidiNumbers } from 'react-piano';

const noteRange = {
  first: MidiNumbers.fromNote('c3'),
  last: MidiNumbers.fromNote('f4'),
};
const keyboardShortcuts = KeyboardShortcuts.create({
  firstNote: noteRange.first,
  lastNote: noteRange.last,
  keyboardConfig: KeyboardShortcuts.HOME_ROW,
});

function App() {
  return (
    <div>
      {/* <div>
        <PianoRoll noteRange={{min: 21, max: 108}} />
      </div> */}
      <div className="mt-5">
        <ResponsivePiano noteRange={noteRange} keyboardShortcuts={keyboardShortcuts} />
      </div>
    </div>
  );
}

export default App;
