import { createReadStream, writeFileSync } from 'fs';
import { readFile } from 'fs/promises';
import CsvReadableStream from 'csv-reader';

const geoData = JSON.parse(await readFile("./countries-110m.json", "utf8"));

let inputStream = createReadStream('country_props.csv', 'utf8');

inputStream
	.pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: false }))
	.on('data', function (row) {
		let found = false;
		let i = 0;
		for(const country of geoData.objects.countries.geometries){
			if(Number(country.id) === row.at(5)){
				found = true;
				geoData.objects.countries.geometries[i] = {
					...country, 
					properties: {
						...country.properties,
						Continent_Name: row.at(0),
						Continent_Code: row.at(1),
						Country_Name: row.at(2),
						Two_Letter_Country_Code: row.at(3),
						Three_Letter_Country_Code: row.at(4),
						Country_Number: row.at(5),
					}
				};
			}
			i++;
		}
	})
	.on('end', function () {		
		try {
			writeFileSync("../src/lib/data/custom_merged_countries_110m", JSON.stringify(geoData, null, 2));
		} catch (error) {
			console.log("Error Writing to File: ", error);
		}
		console.log('Output to file in lib directory');
	});
