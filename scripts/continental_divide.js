import { writeFileSync } from 'fs';
import { readFile } from 'fs/promises';

const data = JSON.parse(await readFile("./custom_merged_countries_110m.json", "utf8"));

let geoData = {
    AF: [],
    AN: [],
    AS: [],
    EU: [],
    OC: [],
    NA: [],
    SA: [], 
    UND: []
}

for(const country of data.objects.countries.geometries){
    const cc = country.properties?.Continent_Code;
    switch (cc) {
        case "AF":
            geoData = {
                ...geoData,
                AF: [...geoData.AF, country]
            }
            break;
        case "AN":
            geoData = {
                ...geoData,
                AN: [...geoData.AN, country]
            }
            break;
        case "AS":
            geoData = {
                ...geoData,
                AS: [...geoData.AS, country]
            }
            break;
        case "EU":
            geoData = {
                ...geoData,
                EU: [...geoData.EU, country]
            }
            break;
        case "OC":
            geoData = {
                ...geoData,
                OC: [...geoData.OC, country]
            }
            break;
        case "NA":
            geoData = {
                ...geoData,
                NA: [...geoData.NA, country]
            }
            break;
        case "SA":
            geoData = {
                ...geoData,
                SA: [...geoData.SA, country]
            }
            break;
        default:
            geoData = {
                ...geoData,
                UND: [...geoData.UND, country]
            }
            break;
    }
}

try {
    writeFileSync("../src/lib/data/cleaned_continents.json", JSON.stringify(geoData, null, 2));
} catch (error) {
    console.log("Error Writing to File: ", error);
}
console.log('Output to file in lib directory');
