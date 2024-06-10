function createPixel(id, length, position, color) {
  const positionString = position.join(',');

  let formattedString = `
          class Item${id}
          {
              dataType="Marker";
              position[]={${positionString}};
              name="marker_${id}";
              markerType="RECTANGLE";`;

  if (color) {
      formattedString += `
              colorName="${color}";`;
  }

  formattedString += `
              type="";
              a=${length};
              b=${length};
              id=${id};
          };
  `;

  return formattedString;
}

export default createPixel;