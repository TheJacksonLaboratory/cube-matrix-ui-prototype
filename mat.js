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
		$colHead = $m.find('.mat-cols > thead > tr'),
		$colBody = $m.find('.mat-cols > tbody > tr'),
		$rowHead = $m.find('.mat-rows > tbody'),
		nextTimeout = null,
		isSelecting = false,
		selected = {},
		c0, r0;
		
		
	let clearSelected = () => {
		selected.cols = [];
		selected.rows = [];		
	};
	
	let clearSelectedDisplay = () => {
		$matData.find('th,td').removeClass('selected c0 c1 r0 r1');
	};		
			
	let init = (md, $t) => {
		
		let $h = $t.find('thead > tr'),
			$b = $t.find('tbody'),		
			cols = typeof md.cols === 'string' ? dims[md.cols] : md.cols,
			rows = typeof md.rows === 'string' ? dims[md.rows] : md.rows,
			cl = cols.d.length,
			rl = rows.d.length,		
			data = md.data === undefined ? getRandomData(cl, rl) : md.data,
			max = getMax(data) + 1;		
		
		$h.html('<th><b></b></th>');
		$colHead.html('<th><b></b></th>');
		$colBody.html('<th></th>');
	
		for (let n of cols.d) {
			let ch = '<th><b>' + n + '</b></th>';
			$h.append(ch);
			$colHead.append(ch);
			$colBody.append('<td></td>');
		}
		
		$rowHead.empty();
		$b.empty();
	
		for (let ri = 0; ri < rl; ri += 1) {
			
			let $r = $('<tr>'),
				rh = '<th>' + rows.d[ri] + '</th>';
				
			$b.append($r);
			$r.append(rh);
			$rowHead.append('<tr>' + rh + '<td></td></tr>');
			
			for (let ci = 0; ci < cl; ci += 1) {
				
				let n = data[ri][ci],
					mag = parseInt(n / max * 10, 10);
				let $c = $('<td class="m-' + mag + '">' + data[ri][ci] + '</td>');
				$r.append($c);

			}
		}
		m.md = md;
		m.md.data = data;
		clearSelected();
	};

	let updateSelectedRange = (e) => {		
		if (isSelecting) {			
			let $td = $(e.target),
				ce = $td.index() - 1,
				re = $td.closest('tr').index(),
				c1 = Math.min(c0, ce),
				c2 = Math.max(c0, ce),
				r1 = Math.min(r0, re),
				r2 = Math.max(r0, re);
				
			clearSelected();

			for (let ri = r1; ri <= r2; ri += 1) {
				selected.rows.push(ri);
			}
			for (let ci = c1; ci <= c2; ci += 1) {
				selected.cols.push(ci);
			}
			updateSelectedDisplay();
		}
	};	
	
	let updateSelectedDisplay = () => {		
		clearSelectedDisplay();
		for (let ri in selected.rows) {
			let rn = selected.rows[ri] + 1,
				rcl = 'selected';
			if (rn === getMinArray(selected.rows) + 1) { rcl += ' r0'; }
			if (rn === getMaxArray(selected.rows) + 1) { rcl += ' r1'; }
			let $ri = $matData.find('tbody tr:nth-child(' + rn + ')');
			$matData.find('tbody > tr:nth-child(' + rn + ') > th').addClass('selected');
			for (let ci in selected.cols) {
				let cn = selected.cols[ci] + 2,
					ccl = rcl;
				if (cn === getMinArray(selected.cols) + 2) { ccl += ' c0'; }
				if (cn === getMaxArray(selected.cols) + 2) { ccl += ' c1'; }
				$ri.find('td:nth-child(' + cn + ')').addClass(ccl);
				$matData.find('thead th:nth-child(' + cn + ')').addClass('selected');
			}
		}
	};	

	let initHandlers = () => {
		let $tds = $matData.find('td'),
			$rhs = $matData.find('tbody th');
		
		$tds.on('mouseenter', (e) => {
			updateSelectedRange(e);
			$matData.find('thead th:nth-child(' + ($(e.target).index() + 1) + ')').addClass('hovering');	
		});
			
		$tds.on('mouseleave', (e) => {
			$matData.find('thead th:nth-child(' + ($(e.target).index() + 1) + ')').removeClass('hovering');
		});
		
		$matData.find('thead th').on('click', (e) => {			
			let $th = $(e.target).closest('th'),
				ci = $th.index() - 1,
				si = selected.cols.indexOf(ci);
				
			if (si !== -1) {
				selected.cols.splice(si, 1);				
			} else {
				if (selected.rows === undefined || selected.rows.length === 0 ) {
					selected.rows = [];
					for (let ri = 0; ri < m.md.data.length; ri += 1) {
						selected.rows.push(ri);
					}
				}
				selected.cols.push(ci);
			}
			updateSelectedDisplay();			
		});
		
		$matData.find('tbody th').on('click', (e) => {
			let $tr = $(e.target).closest('tr'),
				ri = $tr.index(),
				si = selected.rows.indexOf(ri);
			
			if (si !== -1) {
				selected.rows.splice(si, 1);				
			} else {
				if (selected.cols === undefined || selected.cols.length === 0 ) {
					selected.cols = [];
					for (let ci = 0; ci < m.md.data[0].length; ci += 1) {
						selected.cols.push(ci);
					}
				}								
				selected.rows.push(ri);
			}
			updateSelectedDisplay();				
		});
		
		$tds.on('mousedown', (e) => {
			e.preventDefault();		
			let $td = $(e.target);			
			isSelecting = true;
			c0 = $td.index() - 1;
			r0 = $td.closest('tr').index();
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
	
	let updateWithNext = (ms) => {
		isSelecting = false;
		clearSelectedDisplay();
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

	init(o.md, $matData);
	initHandlers();

	m.$m = $m;
	
	m.setCols = (cols) => {		
		let md = Object.assign(o.md, { cols: cols });
		init(md, $matNext);
		$m.removeClass('rot-x').addClass('rot-y');
		updateWithNext(900);
	};
	
	m.setRows = (rows) => {		
		let md = Object.assign(o.md, { rows: rows });
		init(md, $matNext);
		$m.removeClass('rot-y').addClass('rot-x');
		updateWithNext(900);
	};	
	
	return m;
	
};


$(function() {

	let m = mat({ id: 'm1', md: mats[0]});
	
	$('#test-1').on('click', () => { m.setRows('assay'); });
	$('#test-2').on('click', () => { m.setRows('genotype'); });
	$('#test-3').on('click', () => { m.setCols('sample'); });	

});

