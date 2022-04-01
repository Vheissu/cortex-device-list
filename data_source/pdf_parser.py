#!/usr/bin/env python3

import fitz, sys, re, pprint

# Let's define our terms here so they'll be easier to change later
manual = "Manual_1.3.pdf"
VDL_name = "Virtual Device List"
VDL_header = "Virtual Device List"
start_page = 0

# Below list:
#		- Nuke any digits hanging out at the end of a line, this kills page numbers and such
# 	- Nuke blank line
ignore_strings = ["New","•",VDL_header]
ignore_regexp = ['^\d+\n','(?m)^\s*$\s*' ]

# List of headers to look for in the manual to let us know we hit a new section
headers = ["Guitar Amps", "Bass Amps", "Neural Capture", "Cabs", 'IRs by Adam “Nolly” Getgood', 'Other third party IRs', "Guitar Overdrive", "Bass Overdrive", "Delay", "Reverb", "Compressor", "Pitch", "Modulation", "Morph", "Filter", "EQ", "Wah", "Looper", "Utility"]

# Define some useful functions - TODO separate these out into an object later
def filter_text(text):
	global ignore_strings, ignore_regexp
	# We start filtering out things we don't want using our ignore list
	for item in ignore_strings:
		text = text.replace(item,'')
	# Now for some regular expressions
	for item in ignore_regexp:
		text = re.sub(item,'',text)
	return text

def get_text():
	global start_page, VDL_name, VDL_header
	final_page_text=""
	while(True):
		page_text=[]
		page=doc[start_page]
		blocks = page.get_text("blocks", sort=True)
		blocks.sort(key=lambda b: (b[1], b[0]))
		for b in blocks:
			content = b[4]
			# This is an UGLY hack
			# We look for entries that have only a single bullet and nuke the internal 
			# line breaks in it. That way we catch line wraps in the PDF
			if content.count("•") == 1:
				# Get rid of all embedded newlines
				content = content.replace("\n","")
				# But we definitely want to make sure the entry has a newline at the end
				content = content + "\n"
			page_text.append(content)
		temp_page_text = ''.join(page_text)
		# We rely on the header to tell us this is still a virtual device list page
		if not VDL_header in temp_page_text:
			break
		else:
			# Let's clear out the stuff we don't want
			temp_page_text = filter_text(temp_page_text)
			# Now append it and start the cycle over on the next page
			final_page_text += temp_page_text
			start_page=start_page + 1
	return final_page_text

# Let's start working it
doc = fitz.open(manual)
toc = doc.get_toc()

# Page to start looking for virtual devices in manual
for item in toc:
	if item[1] == VDL_name:
		start_page=item[2]-1 # Since we need to be 0 based

# Get the cleaned up text
text = get_text()
current_header = ""

# Start building a dictionary based on the text we got
content_dict = {}
for line in text.splitlines():
	if line in headers:
		# We have a new header!
		current_header = line
		content_dict[current_header] = []
	else:
		# Stuff that exists outside of the headers, we don't care about it
		if current_header == "":
			next
		else:
			content_dict[current_header].append(line)

# We have a dictionary of our data, let's do something with it
pp = pprint.PrettyPrinter(indent=2)
pp.pprint(content_dict)
