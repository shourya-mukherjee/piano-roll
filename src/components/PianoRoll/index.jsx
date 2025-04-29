import React, { useRef, useEffect, useState } from 'react';

function PianoRoll({
  noteRange,
  width,
  height = 400,
  onPlayNote,
  onStopNote,
}) {
  const canvasRef = useRef(null);
  // Track active notes and their starting positions
  const [notes, setNotes] = useState([]);
  // Track time position
  const [scrollPosition, setScrollPosition] = useState(0);
  // Animation frame ID for cleanup
  const animationFrameRef = useRef(null);
  // Timestamp to track elapsed time
  const lastTimeRef = useRef(null);
  // Scroll speed in pixels per second
  const scrollSpeed = 100;
  // Note beam thickness (reduced from full width)
  const beamThickness = 0.6; // 60% of note width

  // Calculate dimensions for each note column
  const totalNotes = noteRange.last - noteRange.first + 1;
  const noteWidth = width / totalNotes;

  // Convert MIDI note to X position
  const getNoteX = (midiNumber) => {
    const noteIndex = midiNumber - noteRange.first;
    return noteIndex * noteWidth;
  };

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const animate = (timestamp) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      
      // Calculate time delta since last frame
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;
      
      // Update scroll position based on time
      setScrollPosition(prev => prev + (scrollSpeed * deltaTime / 1000));
      
      // Clear canvas with dark background
      ctx.fillStyle = '#1E1E1E';
      ctx.fillRect(0, 0, width, height);

      // Draw horizontal time divisions (lighter grey)
      const timeGridSpacing = 20; // pixels between horizontal lines
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 1;
      
      // Draw time grid with scrolling
      const offset = scrollPosition % timeGridSpacing;
      for (let y = height - offset; y >= 0; y -= timeGridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw vertical note divisions
      for (let note = noteRange.first; note <= noteRange.last; note++) {
        const x = getNoteX(note);
        ctx.beginPath();
        ctx.strokeStyle = '#333333';
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();

        // Slightly darker background for black keys
        const isBlackKey = [1, 3, 6, 8, 10].includes(note % 12);
        if (isBlackKey) {
          ctx.fillStyle = '#1A1A1A';
          ctx.fillRect(x, 0, noteWidth, height);
        }
      }

      // Draw notes
      ctx.fillStyle = '#FF7F50'; // Coral color
      notes.forEach(note => {
        const x = getNoteX(note.midiNumber);
        // Calculate center position for the note
        const noteCenter = x + (noteWidth / 2);
        // Apply beam thickness (narrower than the full note width)
        const beamWidth = noteWidth * beamThickness;
        
        // Calculate y positions with scroll
        const yStart = height - (scrollPosition - note.startPosition);
        
        // For active notes, the length should exactly match how far we've scrolled
        const noteLength = note.active 
          ? scrollPosition - note.startPosition // Real-time length based on scroll
          : note.length; // Fixed length for released notes
        
        const yEnd = yStart - noteLength;
        
        // Only draw if note is visible on screen
        if (yStart >= 0 || yEnd <= height) {
          // Center the beam on the note
          ctx.fillRect(
            noteCenter - (beamWidth / 2), // center the beam
            yEnd,
            beamWidth,
            noteLength
          );
        }
      });

      // Remove notes that have scrolled out of view
      if (notes.length > 0) {
        setNotes(prev => prev.filter(note => {
          const yPos = height - (scrollPosition - note.startPosition);
          return yPos > -200; // Keep notes that are just above the visible area
        }));
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [width, height, notes, noteRange, noteWidth, scrollSpeed]);

  // Update active notes when piano keys are played
  useEffect(() => {
    const handleNoteOn = (e) => {
      const midiNumber = e.detail.midiNumber;
      // Add new note with current position as starting point
      setNotes(prev => [
        ...prev,
        {
          id: `${midiNumber}-${Date.now()}`, // Create unique ID for the note
          midiNumber,
          startPosition: scrollPosition,
          length: 0, // Will grow until note is released
          active: true,
        }
      ]);
    };

    const handleNoteOff = (e) => {
      const midiNumber = e.detail.midiNumber;
      // Find active note and set its final length
      setNotes(prev => prev.map(note => {
        if (note.midiNumber === midiNumber && note.active) {
          return {
            ...note,
            // Store the final length based on exactly how far we've scrolled
            length: scrollPosition - note.startPosition,
            active: false,
          };
        }
        return note;
      }));
    };

    // Subscribe to note events
    window.addEventListener('pianoNoteOn', handleNoteOn);
    window.addEventListener('pianoNoteOff', handleNoteOff);

    return () => {
      window.removeEventListener('pianoNoteOn', handleNoteOn);
      window.removeEventListener('pianoNoteOff', handleNoteOff);
    };
  }, [scrollPosition]);

  // We don't need a separate effect to update active note lengths
  // The length will be calculated during rendering based on scrollPosition

  return (
    <div className="piano-roll-container">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          marginBottom: '20px',
          borderRadius: '4px',
        }}
      />
    </div>
  );
}

export default PianoRoll;