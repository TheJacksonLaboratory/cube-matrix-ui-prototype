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

let getMax = (data) => {	
	return data.reduce((n, a) => {
		let ma = a.reduce((c1, c2) => { return Math.max(c1, c2); });
	    return Math.max(n, ma);
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
		nextTimeout = null;
		
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
	};
	
	let initHandlers = () => {
		$matData.find('td').hover(
			(e) => {
				
				
				// console.log($(e.target).index());
				
				
				$matData.find('thead th:nth-child(' + ($(e.target).index() + 1) + ')').addClass('hovering');	
			},
			(e) => {
				$matData.find('thead th:nth-child(' + ($(e.target).index() + 1) + ')').removeClass('hovering');
			}
				
			
			);		
		
	};
	
	let updateWithNext = (ms) => {
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

