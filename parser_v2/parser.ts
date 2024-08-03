#!/usr/bin/env node

import * as fs from 'fs';
import * as pdf from 'pdf-parse';
import * as readline from 'readline';

// Define our terms
const manual = "Manual_1.3.pdf";
const VDL_name = "Virtual Device List";
const VDL_header = "Virtual Device List";
let start_page = 0;

// Ignore strings and regular expressions
const ignore_strings = ["New", "•", VDL_header];
const ignore_regexp = [/^\d+\n/, /(?m)^\s*$\s*/];

// Headers to look for in the manual
const headers = ["Guitar Amps", "Bass Amps", "Neural Capture", "Cabs", 'IRs by Adam "Nolly" Getgood', 'Other third party IRs', "Guitar Overdrive", "Bass Overdrive", "Delay", "Reverb", "Compressor", "Pitch", "Modulation", "Morph", "Filter", "EQ", "Wah", "Looper", "Utility"];

// Define useful functions
function filterText(text: string): string {
    for (const item of ignore_strings) {
        text = text.replace(item, '');
    }
    for (const item of ignore_regexp) {
        text = text.replace(item, '');
    }
    return text;
}

async function getText(doc: any): Promise<string> {
    let final_page_text = "";
    while (true) {
        const page = doc.getPage(start_page);
        const content = await page.getTextContent();
        let page_text = content.items.map((item: any) => item.str).join(' ');

        if (!page_text.includes(VDL_header)) {
            break;
        } else {
            page_text = filterText(page_text);
            final_page_text += page_text;
            start_page++;
        }
    }
    return final_page_text;
}

async function main() {
    const dataBuffer = fs.readFileSync(manual);
    const data = await pdf(dataBuffer);

    // Find the start page
    const toc = data.outline;
    for (const item of toc) {
        if (item.title === VDL_name) {
            start_page = item.pageNumber - 1;
            break;
        }
    }

    // Get the cleaned up text
    const text = await getText(data);

    // Build a dictionary based on the text
    const content_dict: { [key: string]: string[] } = {};
    let current_header = "";

    const rl = readline.createInterface({
        input: fs.createReadStream('temp.txt'),
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        if (headers.includes(line)) {
            current_header = line;
            content_dict[current_header] = [];
        } else {
            if (current_header !== "") {
                content_dict[current_header].push(line);
            }
        }
    }

    // Print the dictionary
    console.log(JSON.stringify(content_dict, null, 2));
}

main().catch(console.error);
