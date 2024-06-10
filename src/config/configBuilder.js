// configBuilder.js
import createPixel from './createPixel.js';

export function configBuilder(name, qrCode, fgColor, bgColor) {
    // Calculate length
    const size = qrCode.length;
    const length = (1000 / size) * 2;

    // Start building the config string
    let configString = `version=54;
center[]={0,0,0};
class items
{
	items=1;
	class Item0
	{
		dataType="Layer";
		name="${name}";
		class Entities
		{
			items=${size * size};
`;

    let id = 0;  // Start ID from 0
    let z = 0;

    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            const color = qrCode[row][col] === 1 ? fgColor : bgColor;
            const x = -col * length * 2;
            const position = [x, 0, z];
            configString += createPixel(id, length, position, color);
            id++;
        }
        z += length * 2;
    }

    // Close the entities, item, and class items blocks
    configString += `
                };
	        };
        };
    `;

    return configString;
}

export default configBuilder;