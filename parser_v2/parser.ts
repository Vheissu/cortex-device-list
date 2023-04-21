import * as pdfParse from 'pdf-parse';
import * as fs from 'fs';

const manual = 'Manual_1.3.pdf';
const VDL_header = 'Virtual Device List';

const headers = ['Guitar Amps', 'Bass Amps', 'Neural Capture', 'Cabs', 'IRs by Adam “Nolly” Getgood', 'Other third party IRs', 'Guitar Overdrive', 'Bass Overdrive', 'Delay', 'Reverb', 'Compressor', 'Pitch', 'Modulation', 'Morph', 'Filter', 'EQ', 'Wah', 'Looper', 'Utility'];

async function get_text() {
  const data = fs.readFileSync(manual);
  const pdfDocument = await pdfParse(data);
  return pdfDocument.text;
}

(async () => {
  const text = await get_text();
  const vdlStartIndex = text.indexOf(VDL_header) + VDL_header.length;
  const vdlEndIndex = text.length; // Assumes VDL section goes until the end of the document; adjust if needed.

  const vdlSection = text.slice(vdlStartIndex, vdlEndIndex).trim();          
  const vdlLines = vdlSection.split('\n');

  let current_header = '';
  const content_dict: { [key: string]: any[] } = {};

  for (const line of vdlLines) {
    if (headers.includes(line)) {
      current_header = line;
      content_dict[current_header] = [];
    } else {
      // Check if the line contains an item in the format we're looking for
      const itemRegex = /[A-Za-z\d\s]+\(.*\)/;
      if (current_header != '' && itemRegex.test(line)) {
        const modelledName = line.split('(')[0].trim();
        const originalName = line.split('(')[1].split(')')[0].replace(/®/g, '');

        content_dict[current_header].push({ modelledName, originalName });
      }
    }
  }

  console.log(content_dict);
})();
