var sketch = function(p) {

	p.fps = 20
	p.allglyphs = []

	//
	// display variables

	p.glyph_width=30;
	p.glyph_height=40;
	p.glyphsize_map = 20;

	p.activecol_bg = "white" // accepts hexidecimal
	p.inactivecol_bg = "red"
	p.activecol_txt = "red"
	p.inactivecol_txt = "white"

	p.displayGlyphLarge_txt = "white"
	p.displayGlyphLarge_bg = "blue"

	p.glyphborder_col = "white";
	p.glyphborder = 0.4;

	// list of characters in unicode
	p.tmplist = "0141,0142,0160,0161,00DD,00FD,00DE,00FE,017D,017E,00BD,00BC,00B9,00BE,00B3,00B2,2212,00D7,0021,0022,0023,0024,0025,0026,0027,0028,0029,002A,002B,002C,002D,002E,002F,0030,0031,0032,0033,0034,0035,0036,0037,0038,0039,003A,003B,003C,003D,003E,003F,0040,0041,0042,0043,0044,0045,0046,0047,0048,0049,004A,004B,004C,004D,004E,004F,0050,0051,0052,0053,0054,0055,0056,0057,0058,0059,005A,005B,005C,005D,005E,005F,0060,0061,0062,0063,0064,0065,0066,0067,0068,0069,006A,006B,006C,006D,006E,006F,0070,0071,0072,0073,0074,0075,0076,0077,0078,0079,007A,007B,007C,007D,00C4,00C5,00C7,00C9,00D1,00DC,00E1,00E0,00E2,00E4,00E3,00E5,00E7,00E9,00E8,00EA,00EB,00ED,00EC,00EE,00EF,00F1,00F3,00F2,00F4,00F6,00F5,00FA,00F9,00FB,00FC,2020,00B0,00A2,00A3,00A7,2022,00B6,00DF,00AE,00A9,2122,00B4,00A8,00C6,00D8,00A5,00E6,00F8,00BF,00A1,00AB,00BB,2026,00C0,00C3,00D5,0152,0153,2013,2014,201C,201D,2018,2019,00F7,00FF,0178,20AC,2039,203A,FB01,FB02,2021,201A,201E,2030,00C2,00CA,00C1,00CB,00C8,00CD,00CE,00CF,00CC,00D3,00D4,00D2,00DA,00DB,00D9,0131,02C6,02DC,00AF,02D8,02D9,02DA,00B8,02DD,02DB,02C7,00F0,00D0,00D6,00B7"


	// ================================

	p.glyph_rows = 0;
	p.glyph_cols = 0;

	p.global_glyphw = 0;
	p.global_glyphh = 0;


	p.preload = function() {
		p.tfont = p.loadFont('assets/IBMPlexMono-Bold.ttf');
	}

	p.setup = function() {

		p.frameRate(p.fps)
		p.textFont(p.tfont)

		p.canvasDiv = document.getElementById(p.divattach);
		p.containerwidth = p.canvasDiv.offsetWidth;
		p.canvaswidth = p.containerwidth
		p.sketchCanvas = p.createCanvas(p.containerwidth,p.canvasheight);
		p.sketchCanvas.parent(p.divattach);
		p.sketchCanvas.mouseClicked(p.canvasClicked);

		p.doResize();

		p.glyphs_to_show = p.tmplist.split(",")
		
		p.createGlyphList();
		p.rearrangeGlyphs();
		p.doResize();

	}

	p.displayGlyphLarge = function(bigtxt, tx, ty, tw, th, glyphcol, glyphrow) {

		p.fill(p.displayGlyphLarge_bg);

		// CENTERED ON CANVAS: 
		// midx = p.canvaswidth/2
		// midy = p.canvasheight/2
		// boxw = 140;
		// boxh = 160;
		// p.big_txt_size = boxw / 1.5; //70;
		// p.rect(midx-(boxw/2), midy-(boxh/2), boxw, boxh)

		// p.fill(p.displayGlyphLarge_txt);
		// p.textAlign(p.CENTER, p.CENTER)
		// p.textSize(p.big_txt_size)
		// p.text(bigtxt, midx, midy-(p.big_txt_size/8))

		// GRID

		//midx = p.canvaswidth/2
		//midy = p.canvasheight/2

		boxsize = 4;

		boxw = p.global_glyphw * boxsize;
		boxh = p.global_glyphh * boxsize;
		p.big_txt_size = boxw / 1.5; //70;

		p.offsetx=0;
		p.offsety=0;

		if (glyphcol+1>p.glyph_cols-(boxsize+1)) {
			p.offsetx = boxw*-1 - p.global_glyphw;
		}
		if (glyphrow-2>p.glyph_rows-(boxsize+1)) {
			p.offsety = boxh*-1 + p.global_glyphh;
		}

		p.rect(tx+p.global_glyphw+p.offsetx, ty+p.offsety, boxw, boxh)
		p.fill(p.displayGlyphLarge_txt);
		p.textAlign(p.CENTER, p.CENTER)
		p.textSize(p.big_txt_size)
		p.text(bigtxt, tx+(boxw/2)+p.global_glyphw+p.offsetx, ty+(boxh/2)-(p.big_txt_size/8)+p.offsety)

		// console.log("total cols:", p.glyph_cols-1)
		// console.log(glyphcol, glyphrow);

	}


	p.createGlyphList = function() {

		for (var n=0; n<p.glyphs_to_show.length; n++) {
			ng = new Glyph();
			ng.w = p.glyph_width
			ng.h = p.glyph_height
			ng.col_bg = p.activecol_bg;
			ng.col_txt = p.activecol_txt;
			ng.col_border = p.glyphborder_col; 
			p.tmpuni = p.glyphs_to_show[n];
			ng.txt = String.fromCharCode(parseInt(p.tmpuni,16))
			ng.uni = p.tmpuni;
			p.allglyphs.push(ng);
		}

	}


	p.rearrangeGlyphs = function() {

		p.position_x = 0;
		p.position_y = 0;
		p.glyph_rows = 0;
		p.glyph_cols = 0;

		p.tmpwidth = p.canvaswidth / p.glyph_width;
		p.maxcols = Math.floor(p.canvaswidth / p.glyph_width);

		if (p.tmpwidth<p.glyph_width) { 
			p.diffx  = p.canvaswidth - ( Math.floor(p.canvaswidth / p.glyph_width)*p.glyph_width ); 
			p.tmpwidth = p.glyph_width + ( p.diffx/p.maxcols );
		} else {
			p.maxcols = Math.floor(p.canvaswidth / p.tmpwidth);
		}

		p.global_glyphw = p.tmpwidth;
		p.global_glyphh = p.glyph_height;

		p.colcount=0;

		for (var n=0; n<p.allglyphs.length; n++) {

			glif = p.allglyphs[n]
			glif.x = p.position_x;
			glif.y = p.position_y;
			glif.w = p.tmpwidth;
			p.position_x += p.tmpwidth;

			//console.log(p.position_y)

			if ( p.position_x > p.canvaswidth+1 ) {
				//console.log(p.position_x, word.txt)
				p.position_y += p.glyph_height
				glif.x = 0;
				glif.y = p.position_y;
				p.glyph_rows+=1;
				p.colcount=0;
				p.position_x = 0;
				n-=1
			}	

			glif.colpos = p.colcount;
			glif.rowpos = p.glyph_rows;

			//glif.display();

			p.colcount+=1

		}

		p.glyph_cols = p.maxcols;

		// console.log("total rows: "+p.glyph_rows);
		// console.log("total cols: "+p.glyph_cols);

		p.canvasheight = (p.glyph_rows+1) * p.glyph_height

	}


	p.draw = function() {

		let bodyelement = p.select('body');
		p.background(p.color("p.bgcol"));

		var n=0;

		// display glyphs grid
		for (n=0; n<p.allglyphs.length; n++) {
			cg = p.allglyphs[n];
			cg.display();
		}

		// check if active glyph
		for (n=0; n<p.allglyphs.length; n++) {
			cg = p.allglyphs[n];
			cg.active();
		}

	}


	class Glyph {

		constructor() {

			this.p = p;
			this.txt = ""
			this.uni = ""
			this.x = 0;
			this.y = 0;
			this.w = 0;
			this.h = 0;
			this.col_bg = ""
			this.col_txt = ""
			this.col_border = ""
			this.advancewidth = 0;
			this.colpos = 0;
			this.rowpos = 0;

		}

		display() { 

			if (p.glyphborder>0) { 
				p.strokeWeight(p.glyphborder);
				p.stroke(this.col_border)
			} else {
				p.noStroke();
			}

			p.fill(this.col_bg);
			p.rect(this.x, this.y, this.w, this.h);

			p.noStroke();
			p.fill(this.col_txt);
			p.textAlign(p.CENTER, p.CENTER)
			p.textSize(p.glyphsize_map)
			p.text(this.txt, this.x+(this.w/2), this.y+(this.h/2))

		}

		active() {

			if (p.mouseX>this.x && p.mouseX<this.x+this.w && p.mouseY>this.y && p.mouseY<this.y+this.h) {
				p.displayGlyphLarge(this.txt, this.x, this.y, this.w, this.h, this.colpos, this.rowpos);
				this.col_bg = p.activecol_bg;
				this.col_txt = p.activecol_txt;
			} else { 
				this.col_bg = p.inactivecol_bg;
				this.col_txt = p.inactivecol_txt;
			}

		}

	}


	p.windowResized = function() {
		//console.log("resize");
		p.doResize();
	}

	p.doResize = function() {
		p.glyph_rows=0
		p.rearrangeGlyphs();
		p.canvasDiv = document.getElementById('glyphmapdiv');
		p.containerwidth = p.canvasDiv.offsetWidth;
		p.canvaswidth = p.containerwidth
		p.resizeCanvas(p.canvaswidth, p.canvasheight);
		//p.print ("resized")
	}

	p.canvasClicked = function() {
		//console.log("clicked");
	}

}

glyphmapsketch = new p5(sketch);
glyphmapsketch.divattach = 'glyphmapdiv'


