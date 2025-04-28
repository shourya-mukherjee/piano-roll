import React from 'react';
// https://github.com/danigb/smplr
import { Soundfont } from 'smplr';

class SoundfontProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeAudioNodes: {},
      instrument: null,
    };
  }

  componentDidMount() {
    this.loadInstrument(this.props.instrumentName);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.instrumentName !== this.props.instrumentName) {
      this.loadInstrument(this.props.instrumentName);
    }
  }

  loadInstrument = (instrumentName) => {
    // Re-trigger loading state
    this.setState({
      instrument: null,
    });

    const soundfont = new Soundfont(this.props.audioContext, {
      instrument: instrumentName,
      kit: this.props.soundfont,
    });
    soundfont.load.then(() => {
      this.setState({
        instrument: soundfont,
      });
    });
  };

  playNote = (midiNumber) => {
    this.props.audioContext.resume().then(() => {
      if (!this.state.instrument) return;
      const stopNote = this.state.instrument.start(midiNumber);
      console.log(stopNote);
      this.setState({
        activeAudioNodes: {
          ...this.state.activeAudioNodes,
          [midiNumber]: stopNote,
        },
      });
    });
  };

  stopNote = (midiNumber) => {
    this.props.audioContext.resume().then(() => {
      if (!this.state.activeAudioNodes[midiNumber]) {
        return;
      }
      // stopNote is a function to stop the note
      const stopNote = this.state.activeAudioNodes[midiNumber];
      if (stopNote) {
        stopNote();
        this.setState({
          activeAudioNodes: {
            ...this.state.activeAudioNodes,
            [midiNumber]: null,
          },
        });
      }
    });
  };

  render() {
    return this.props.render({
      isLoading: !this.state.instrument,
      playNote: this.playNote,
      stopNote: this.stopNote,
    });
  }
}

export default SoundfontProvider;
