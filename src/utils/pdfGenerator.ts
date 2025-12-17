import jsPDF from 'jspdf';
import type { Game, SelectedAnswer } from '@/types';

export function generatePDF(game: Game, selectedAnswers: Record<string, SelectedAnswer>): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const lineHeight = 8;
  let y = margin;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(124, 58, 237); // violet-600
  doc.text('Mad Libs Results', pageWidth / 2, y, { align: 'center' });
  y += 15;

  // Game info
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(`Game: ${game.title}`, pageWidth / 2, y, { align: 'center' });
  y += 8;
  doc.text(`Players: ${Object.keys(game.players || {}).length}`, pageWidth / 2, y, { align: 'center' });
  y += 8;
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, y, { align: 'center' });
  y += 20;

  // Divider
  doc.setDrawColor(224, 224, 224);
  doc.line(margin, y, pageWidth - margin, y);
  y += 15;

  // Story with filled answers
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(33, 33, 33);

  let story = game.story;
  game.blanks.forEach((blank) => {
    const answer = selectedAnswers[blank.id];
    const regex = new RegExp(`\\[\\[BLANK:${blank.id}:[^\\]]+\\]\\]`, 'g');
    const displayAnswer = answer ? answer.answer : `[${blank.type}]`;
    story = story.replace(regex, `**${displayAnswer}**`);
  });

  const paragraphs = story.split('\n');

  paragraphs.forEach((paragraph) => {
    if (y > doc.internal.pageSize.height - margin) {
      doc.addPage();
      y = margin;
    }

    const words = paragraph.split(' ');
    let line = '';

    words.forEach((word) => {
      const testLine = line + word + ' ';
      const metrics = doc.getTextWidth(testLine);

      if (metrics > pageWidth - margin * 2) {
        if (y > doc.internal.pageSize.height - margin) {
          doc.addPage();
          y = margin;
        }
        renderLine(doc, line, margin, y);
        y += lineHeight;
        line = word + ' ';
      } else {
        line = testLine;
      }
    });

    if (line.trim()) {
      if (y > doc.internal.pageSize.height - margin) {
        doc.addPage();
        y = margin;
      }
      renderLine(doc, line, margin, y);
      y += lineHeight;
    }
    y += lineHeight / 2;
  });

  // Answer key section
  y += 10;
  if (y > doc.internal.pageSize.height - 60) {
    doc.addPage();
    y = margin;
  }

  doc.setDrawColor(224, 224, 224);
  doc.line(margin, y, pageWidth - margin, y);
  y += 15;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(124, 58, 237);
  doc.text('Answer Key', margin, y);
  y += 12;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  game.blanks.forEach((blank, i) => {
    if (y > doc.internal.pageSize.height - margin) {
      doc.addPage();
      y = margin;
    }

    const answer = selectedAnswers[blank.id];
    const playerName = answer?.playerName || 'Unknown';

    doc.setTextColor(100);
    doc.text(`${i + 1}. ${blank.type}:`, margin, y);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(33, 33, 33);
    const answerText = ` ${answer?.answer || '[Not filled]'}`;
    doc.text(answerText, margin + doc.getTextWidth(`${i + 1}. ${blank.type}: `), y);

    doc.setFont('helvetica', 'italic');
    doc.setTextColor(150);
    doc.text(
      ` - ${playerName}`,
      margin + doc.getTextWidth(`${i + 1}. ${blank.type}: ${answer?.answer || '[Not filled]'} `),
      y
    );

    doc.setFont('helvetica', 'normal');
    y += 8;
  });

  return doc;
}

function renderLine(doc: jsPDF, line: string, x: number, y: number) {
  const parts = line.split(/\*\*([^*]+)\*\*/g);
  let currentX = x;

  parts.forEach((part, i) => {
    if (i % 2 === 1) {
      // Bold/highlighted answer
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(124, 58, 237); // violet-600
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(33, 33, 33);
    }
    doc.text(part, currentX, y);
    currentX += doc.getTextWidth(part);
  });
}
