let getRandomData = (cl, rl) => {	
	let data = [];
	for (let ri = 0; ri < rl; ri += 1) {		
		let row = [];
		for (let ci = 0; ci < cl; ci += 1) {
			row.push(parseInt(Math.random() * 100, 10));
		}
		data.push(row);
	}
	return data;
};

let getMinArray = (a) => {
	return a.reduce((n1, n2) => { return Math.min(n1, n2); });
};

let getMaxArray = (a) => {
	return a.reduce((n1, n2) => { return Math.max(n1, n2); });
};

let getMax = (data) => {	
	return data.reduce((n, row) => {
		let rowMax = getMaxArray(row);
	    return Math.max(n, rowMax);
	}, 0);
};

let mat = (o) => {
	
	let m = {},
		$m = $('#' + o.id),		
		$matData = $m.find('.mat-data'),
		$matNext = $m.find('.mat-next'),
		$colTitle = $m.find('.mat-cols thead > tr:nth-child(1)'),
		$colGroup = $m.find('.mat-cols thead > tr:nth-child(2)'),
		$colHead = $m.find('.mat-cols thead > tr:nth-child(3)'),
		$colBody = $m.find('.mat-cols > tbody > tr'),
		$rowHead = $m.find('.mat-rows > tbody'),
		nextTimeout = null,
		isSelecting = false,
		selected = {},
		startCol, startRow;

	let clearSelected = () => {
		selected.cols = [];
		selected.rows = [];		
	};
	
	let clearSelectedDisplay = () => {
		$matData.find('th,td').removeClass('selected c0 c1 r0 r1');
	};		
			
	let init = (config, $table) => {
		
		let $t = $table.find('thead > tr:nth-child(1)'),
			$g = $table.find('thead > tr:nth-child(2)'),
			$h = $table.find('thead > tr:nth-child(3)'),
			$b = $table.find('tbody'),		
			cl, rl,	max, ct, ch, rt, ri;
					
		m = Object.assign(m, config);

		m.cols = typeof m.cols === 'string' ? dims[m.cols] : m.cols;
		m.rows = typeof m.rows === 'string' ? dims[m.rows] : m.rows;
		cl = m.cols.d.length;
		rl = m.rows.d.length;		
		
		m.cols.g = m.cols.g || [{ n: '', l: cl }];
		m.rows.g = m.rows.g || [{ n: '', l: rl }];
			
		m.data = config.data || getRandomData(cl, rl);
		max = getMax(m.data) + 1;
		
		ct = '<th></th><th></th><th></th><th colspan="' + cl + '">' + m.cols.n + '</th>';
		cg = '<th></th><th></th><th></th><th colspan="' + cl + '"></th>';
		ch = '<th></th><th></th><th class="rh"></th>';

		$t.html(ct);
		$colTitle.html(ct);
		
		$g.html(ch);
		$colGroup.html(ch);
		
		for (let colGroup of m.cols.g) {
			let cla = colGroup.n === '' ? ' class="empty"' : '',
				cg = '<th' + cla + ' colspan="' + colGroup.l + '">' + colGroup.n + '</th>';
			$g.append(cg);
			$colGroup.append(cg);

		}

		$h.html(ch);
		$colHead.html(ch);
		$colBody.html(ch);
		
		for (let n of m.cols.d) {
			let ch = '<th><b>' + n + '</b></th>';
			$h.append(ch);
			$colHead.append(ch);
			$colBody.append('<td></td>');
		}		
		
		rt = '<th class="rt" rowspan="' + rl + '"><b>' + m.rows.n + '</b></th>';

		$rowHead.empty();
		$b.empty();
		
		ri = 0;

		for (let rowGroup of m.rows.g) {
			
			let cla = rowGroup.n === '' ? ' empty' : '',
				rg = '<th class="rg' + cla + '" rowspan="' + rowGroup.l + '"><b>' + rowGroup.n + '</b></th>';
	
			for (let rgi = 0; rgi < rowGroup.l; rgi += 1) {

				let $r = $('<tr>'),
					$rhr = $('<tr>'),
					rh = '<th class="rh">' + m.rows.d[ri] + '</th>';
					
				if (ri === 0) {
					$r.append(rt);
					$rhr.append(rt);
				}
				
				if (rgi === 0) {
					$r.addClass('g0');
					$rhr.addClass('g0');
					$r.append(rg);
					$rhr.append(rg);
				}
				
				if (rgi === rowGroup.l - 1) {
					$r.addClass('g1');
					$rhr.addClass('g1');					
				}
					
				$b.append($r);
				$r.append(rh);
				$rhr.append(rh);
				$rhr.append('<td></td>');
				$rowHead.append($rhr);

				for (let ci = 0; ci < cl; ci += 1) {				
					let n = m.data[ri][ci],
						mag = parseInt(n / max * 10, 10);
					let $c = $('<td class="m-' + mag + '">' + m.data[ri][ci] + '</td>');
					$r.append($c);

				}				
				ri += 1;
			}			
		}
	};

	let updateSelectedRange = (e) => {		
		if (isSelecting) {			
			let $td = $(e.target),
				$tr = $td.closest('tr'),
				endCol = $tr.children('td').index($td),
				endRow = $tr.index(),
				c0 = Math.min(startCol, endCol),
				c1 = Math.max(startCol, endCol),
				r0 = Math.min(startRow, endRow),
				r1 = Math.max(startRow, endRow);
				
			clearSelected();

			for (let ri = r0; ri <= r1; ri += 1) {
				selected.rows.push(ri);
			}
			for (let ci = c0; ci <= c1; ci += 1) {
				selected.cols.push(ci);
			}
			updateSelectedDisplay($matData);
		}
	};	
	
	let updateSelectedDisplay = ($t, suppressClear) => {		
		if (!suppressClear) {
			clearSelectedDisplay();
		}
		for (let ri in selected.rows) {
			let rn = selected.rows[ri] + 1,
				rcl = 'selected';
			if (rn === getMinArray(selected.rows) + 1) { rcl += ' r0'; }
			if (rn === getMaxArray(selected.rows) + 1) { rcl += ' r1'; }
			let $ri = $t.find('tbody tr:nth-child(' + rn + ')');
			$t.find('tbody > tr:nth-child(' + rn + ') > .rh').addClass('selected');
			for (let ci in selected.cols) {
				let cn = selected.cols[ci] + 1,
					ccl = rcl;
				if (cn === getMinArray(selected.cols) + 1) { ccl += ' c0'; }
				if (cn === getMaxArray(selected.cols) + 1) { ccl += ' c1'; }
				$ri.find('td:nth-of-type(' + cn + ')').addClass(ccl);
				$t.find('thead th:nth-child(' + (cn + 3) + ')').addClass('selected');
			}
		}
	};
	
	let selectAllCols = () => {
		selected.cols = [];
		for (let ci = 0; ci < m.cols.d.length; ci += 1) {
			selected.cols.push(ci);
		}		
	};
	
	let selectAllRows = () => {
		selected.rows = [];
		for (let ri = 0; ri < m.rows.d.length; ri += 1) {
			selected.rows.push(ri);
		}		
	};

	let initHandlers = () => {
		let $tds = $matData.find('td'),
			$rhs = $matData.find('tbody th');
		
		$tds.on('mouseenter', (e) => {
			updateSelectedRange(e);
			$matData.find('thead > tr:nth-child(3) > th:nth-child(' + ($(e.target).index() + 1) + ')').addClass('hovering');	
		});
			
		$tds.on('mouseleave', (e) => {
			$matData.find('thead th:nth-child(' + ($(e.target).index() + 1) + ')').removeClass('hovering');
		});
		
		$matData.find('thead > tr:nth-child(3) > th').on('click', (e) => {			
			let $th = $(e.target).closest('th'),
				ci = $th.index() - 3,
				si = selected.cols.indexOf(ci);
				
			if (si !== -1) {
				selected.cols.splice(si, 1);				
			} else {
				if (selected.rows === undefined || selected.rows.length === 0 ) {
					selectAllRows();
				}
				selected.cols.push(ci);
			}
			updateSelectedDisplay($matData);			
		});
		
		$matData.find('tbody th:last-of-type').on('click', (e) => {
			let $tr = $(e.target).closest('tr'),
				ri = $tr.index(),
				si = selected.rows.indexOf(ri);
			
			if (si !== -1) {
				selected.rows.splice(si, 1);				
			} else {
				if (selected.cols === undefined || selected.cols.length === 0 ) {
					selectAllCols();
				}								
				selected.rows.push(ri);
			}
			updateSelectedDisplay($matData);				
		});
		
		$tds.on('mousedown', (e) => {
			e.preventDefault();		
			let $td = $(e.target),
				$tr = $td.closest('tr');			
			isSelecting = true;
			startCol = $tr.children('td').index($td);
			startRow = $tr.index();
			console.log($td.prop('tagName') + ': ' + startCol);
		});
		
		$matData.on('mouseup mouseleave', (e) => {			
			if (isSelecting) {				
				updateSelectedRange(e);
				isSelecting = false;
				if (getMinArray(selected.cols) === getMaxArray(selected.cols) && getMinArray(selected.rows) === getMaxArray(selected.rows)) {
					clearSelected();
					clearSelectedDisplay();
				}
			}
		});
	};
	
	let updateWithNext = (ms, callback) => {
		isSelecting = false;
		if (nextTimeout !== null) {
			window.clearTimeout(nextTimeout);
			nextTimeout = null;
		}
		nextTimeout = window.setTimeout(() => {
			$matData.html($matNext.html());
			initHandlers();
			$m.removeClass('rot-x rot-y');
		}, ms);
	};

	init(o.config, $matData);
	clearSelected();
	initHandlers();

	m.$m = $m;
	
	m.setCols = (cols) => {		
		init({ cols: cols }, $matNext);
		$m.removeClass('rot-x').addClass('rot-y');
		if (selected.rows.length > 0) {
			selectAllCols();
			updateSelectedDisplay($matNext, true);
		}
		updateWithNext(900);
	};
	
	m.setRows = (rows) => {		
		init({ rows: rows }, $matNext);
		$m.removeClass('rot-y').addClass('rot-x');
		if (selected.cols.length > 0) {
			selectAllRows();
			updateSelectedDisplay($matNext, true);
		}
		updateWithNext(900);
	};
	
	$('body').on('click', (e) => {		
		let $e = $(e.target);
		if ($e.prop('tagName') === 'BODY' || $e.hasClass('rot')) {
			clearSelected();
			clearSelectedDisplay();
		}
	});
	
	return m;
	
};


$(function() {

	let m = mat({ id: 'm1', config: mats[0]});
	
	$('#test-1').on('click', () => { m.setRows('assay'); });
	$('#test-2').on('click', () => { m.setRows('genotype'); });
	$('#test-3').on('click', () => { m.setCols('sample'); });	

});

