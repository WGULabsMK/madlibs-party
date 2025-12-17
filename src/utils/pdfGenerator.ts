import jsPDF from 'jspdf';
import type { Game, SelectedAnswer } from '@/types';

export function generatePDF(game: Game, selectedAnswers: Record<string, SelectedAnswer>): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 25;
  const lineHeight = 10;
  let y = margin + 10;

  // Title only - clean for Speechify
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(33, 33, 33);

  // Word wrap title if needed
  const titleLines = doc.splitTextToSize(game.title, pageWidth - margin * 2);
  titleLines.forEach((line: string) => {
    doc.text(line, pageWidth / 2, y, { align: 'center' });
    y += 12;
  });

  y += 20;

  // Story with filled answers - clean text only, no formatting markers
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(33, 33, 33);

  // Replace blanks with answers (plain text, no bold markers)
  let story = game.story;
  game.blanks.forEach((blank) => {
    const answer = selectedAnswers[blank.id];
    const regex = new RegExp(`\\[\\[BLANK:${blank.id}:[^\\]]+\\]\\]`, 'g');
    const displayAnswer = answer ? answer.answer : `[${blank.type}]`;
    story = story.replace(regex, displayAnswer);
  });

  // Split into paragraphs and render
  const paragraphs = story.split('\n');

  paragraphs.forEach((paragraph) => {
    if (!paragraph.trim()) {
      y += lineHeight / 2;
      return;
    }

    // Use jsPDF's built-in text wrapping
    const lines = doc.splitTextToSize(paragraph.trim(), pageWidth - margin * 2);

    lines.forEach((line: string) => {
      if (y > doc.internal.pageSize.height - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });

    // Add paragraph spacing
    y += lineHeight / 2;
  });

  return doc;
}
