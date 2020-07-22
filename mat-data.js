const dims = {
	sample: {
		n: 'Sample',
		d: [
			'Whole Mouse',
			'Adipose',
			'Bladder',
			'Cecal Content',
			'Fecal Pellet',
			'Heart',
			'Islet',
			'Kidney',
			'Liver - liver left lobe',
			'Ovary',
			'Plasma',
			'Serum',
			'Skeletal Muscle',
			'Spleen',
			'Testis',
			'Whole Liver - liver',
			'Whole Pancreas'
		]		
	},
	assay: {
		n: 'Assay',
		g: [
			{ n: 'In vitro', l: 6 },
			{ n: 'In vivo', l: 11 },
			{ n: 'Other', l: 1 },
		],
		d: [
			'Genotyping Arrays',
			'Bulk RNA-Seq',
			'Bulk ATAC-Seq',
			'PacBio Iso-Seq',
			'Single-Cell RNA-Seq',
			'Single-Cell ATAC-Seq',
			'Body Weights',
			'Food Intake',
			'Water Intake',
			'7 Day Indirect Caliometry',
			'Glucose Tolerance Test',
			'NMR',
			'DEXA',
			'ECHO',
			'Histology',
			'Microbiome',
			'Whole Pancreas Insulin Assay',
			'Biobanked'		
		]		
	},
	genotype: {
		n: 'Genotype',
		g: [
			{ n: 'Founder Inbred Strains', l: 6 }, // 8
			{ n: 'Collaborative Crosses', l: 7 }, // 20
			{ n: 'Diversity Outbred', l: 4 } // 7
		],
		d: [
			'A/J',
			'C57BL/6J',
			'CAST/EiJ',
			'WSB/EiJ',
			'NOD/ShILtJ',
			'NZO/HiLtJ',
			// '129S1/SvImJ',
			// 'PWK/PhJ',
			// 'CC011 &times; CC027',
			// 'CC011 &times; CC005',
			// 'CC030 &times; CC002',
			// 'CC002 &times; CC075',
			// 'CC024 &times; CC002',
			// 'CC002 &times; CC043',
			// 'CC001 &times; CC042',
			// 'CC012 &times; CC002',
			// 'CC019 &times; CC075',
			'CC043 &times; CC011',
			'CC051 &times; CC019',
			'CC019 &times; CC042',
			'CC051 &times; CC059',
			// 'CC004 &times; CC019',
			// 'CC043 &times; CC042',
			// 'CC075 &times; CC042',
			// 'CC009 &times; CC013',
			'CC042 &times; CC040',
			'CC042 &times; CC060',
			'CC051 &times; CC060',
			'DO1',
			'DO2',
			// 'DO3',
			// 'DO4',
			// 'DO5',
			'DO6',
			'DO500'				
		]
	}
};

const mats = [
	{
		title: 'Assay vs. Sample',	
		cols: 'sample',		
		rows: 'assay'
	},
	{
		title: 'Genotype vs. Sample',	
		cols: 'sample',		
		rows: 'genotype'
	}	
];


